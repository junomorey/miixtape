import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import Q from 'q';
import queryString from 'query-string';
import '../style/App.css';
import '../style/InputContainer.css';
import {isValidArtist, initAndFillPlaylist} from '../js/utils';
import {MAX_ARTISTS} from '../js/constants';

import ArtistTable from './ArtistTable';
import Login from './Login';
import SearchBar from './SearchBar';
import TitleInput from './TitleInput';
import MessageInput from './MessageInput';

const spotifyApi = new Spotify();
spotifyApi.setPromiseImplementation(Q);

class App extends Component {
	constructor(props) {
		super(props);
		const params = this.getHashParams();
		if (params.access_token) {
			spotifyApi.setAccessToken(params.access_token);
		} else {
			console.error('no access token');
		}
		this.state = { 
			artistNames: [],
			playlistName: '',
			message: '',
			createPlaylistClicked: false,
			invalidArtist: '',
		};
		this.addArtist = this.addArtist.bind(this);
		this.removeArtist = this.removeArtist.bind(this);
		this.createPlaylist = this.createPlaylist.bind(this);
		this.updateMessage = this.updateMessage.bind(this);
		this.updateTitle = this.updateTitle.bind(this);
		this.getNextArtistNum = this.getNextArtistNum.bind(this);
		this.renderFlash = this.renderFlash.bind(this);
	}

	getHashParams() {
      	var hashParams = {};
       	var e, r = /([^&;=]+)=?([^&;]*)/g,
       		q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
           hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    updateTitle(newTitle) {
    	this.setState({ playlistName: newTitle} );
    	this.setState({ createPlaylistClicked: false });
    }

    updateMessage(newMessage) {
    	let formattedMsg = newMessage.replace(/\s/g, '').toUpperCase();
    	this.setState({ message: formattedMsg} );
    	this.setState({ createPlaylistClicked: false });
    }

	addArtist(newName) {
		let thisGlobal = this;
		let artistNames = this.state.artistNames;
		if (artistNames.length < MAX_ARTISTS && !artistNames.includes(newName)) {
			isValidArtist(spotifyApi, newName)
			.then(function(isValid) {
				if (isValid) {
					thisGlobal.setState({	
						artistNames: [...thisGlobal.state.artistNames, newName],
						createPlaylistClicked: false,
						invalidArtist: ''
					});
				} else {
					thisGlobal.setState({ invalidArtist: newName });
				}
			})
			.catch(function(err) {
				console.error(err);
			})
		}
	}

	removeArtist(removeName) {
		const filteredNames = this.state.artistNames.filter( name => {
			return name !== removeName;
		});
		this.setState({ artistNames: filteredNames });
		this.setState({ createPlaylistClicked: false });
	}

	createPlaylist() {
		let artistNames = this.state.artistNames;
		let playlistName = this.state.playlistName;
		let message = this.state.message;
		initAndFillPlaylist(spotifyApi, artistNames, playlistName, message);
		this.setState({ createPlaylistClicked: true });
	}

	getNextArtistNum() {
		return this.state.artistNames ? this.state.artistNames.length + 1 : 1
	}

	renderFlash() {
		if (this.state.createPlaylistClicked) {
			return (
				<div className="alert alert-success">
				  <strong>Check your playlists for your mixtape!</strong>
				</div>
			);
		} else if (this.state.invalidArtist !== '') {
			return (
				<div className="alert alert-danger">
				  <strong>Could not find artist {this.state.invalidArtist}</strong>
				</div>
			);
		}
	}

	render() {
		return (
			<div className="App">
				{this.renderFlash()}
				<Login />
				<div className="InputContainer">
					<TitleInput updateTitle={this.updateTitle}/>
					<MessageInput updateMessage={this.updateMessage}/>
					<SearchBar addArtist={this.addArtist} nextArtistNum={this.getNextArtistNum()}/>
				</div>
				<ArtistTable 
					artistNames={this.state.artistNames}
					removeArtist={this.removeArtist}
					createPlaylist={this.createPlaylist}
					createPlaylistClicked={this.state.createPlaylistClicked}
				/>
			</div>
		);
	}
};

export default App;
