import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import Q from 'q';
import queryString from 'query-string';
import '../style/App.css';
import '../style/InputContainer.css';
import {isValidArtist, initAndFillPlaylist} from '../js/utils';
import {MIN_ARTISTS, MAX_ARTISTS} from '../js/constants';

import ArtistTable from './ArtistTable';
import SearchBar from './SearchBar';
import TitleInput from './TitleInput';
import MessageInput from './MessageInput';

const spotifyApi = new Spotify();
spotifyApi.setPromiseImplementation(Q);

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			artistNames: [],
			playlistName: '',
			message: '',
			createPlaylistClicked: false,
			invalidArtist: ''
		};
		this.addArtist = this.addArtist.bind(this);
		this.removeArtist = this.removeArtist.bind(this);
		this.createPlaylist = this.createPlaylist.bind(this);
		this.updateMessage = this.updateMessage.bind(this);
		this.updateTitle = this.updateTitle.bind(this);
		this.getNextArtistNum = this.getNextArtistNum.bind(this);
		this.renderFlash = this.renderFlash.bind(this);
	}

	componentDidMount() {
		const params = this.getHashParams();
		if (params.access_token) {
			spotifyApi.setAccessToken(params.access_token);
		} else {
			console.error('no access token');
		}
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
		this.setState({ createPlaylistClicked: true });
		let fieldsFilled = this.state.playlistName !== '' || this.state.message !== '';
		let minArtists = this.state.artistNames.length >= MIN_ARTISTS;
		let validMessage = /^[a-zA-Z]+$/.test(this.state.message)
		if (fieldsFilled && minArtists && validMessage) {
			let artistNames = this.state.artistNames;
			let playlistName = this.state.playlistName;
			let message = this.state.message;
			initAndFillPlaylist(spotifyApi, artistNames, playlistName, message);	
		}	
	}

	getNextArtistNum() {
		return this.state.artistNames ? this.state.artistNames.length + 1 : 1
	}

	renderFlash() {
		if (this.state.createPlaylistClicked) {
			if (this.state.playlistName === '' || this.state.message === '') {
				return (
					<div className="alert alert-danger">
					  <strong>Please fill all fields.</strong>
					</div>
				);
			} else if (!/^[a-zA-Z]+$/.test(this.state.message)) {
				return (
					<div className="alert alert-danger">
					  <strong>Message can only include letters.</strong>
					</div>
				);
			} else if (this.state.artistNames.length < MIN_ARTISTS){
				return (
					<div className="alert alert-danger">
					  <strong>Please enter at least {MIN_ARTISTS} artists.</strong>
					</div>
				);
			} else {
				return (
					<div className="alert alert-success">
					  <strong>Check your playlists for your mixtape!</strong>
					</div>
				);	
			} 
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
