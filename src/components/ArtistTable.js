import React, { Component } from 'react';
import '../style/ArtistTable.css';

import Artist from './Artist';
import CreatePlaylistButton from './CreatePlaylistButton';

class ArtistTable extends Component {
	constructor(props) {
		super(props);
		this.removeArtist = this.removeArtist.bind(this);
		this.renderArtists = this.renderArtists.bind(this);
		this.createPlaylist = this.createPlaylist.bind(this);
		this.renderCreatePlaylistButton = this.renderCreatePlaylistButton.bind(this);
	}

	removeArtist(removeName) {
		this.props.removeArtist(removeName);
	}

	renderArtists() {
		return this.props.artistNames.map(name => (
			<Artist key={name} name={name} removeArtist={this.removeArtist}/>
		));
	}

	createPlaylist() {
		this.props.createPlaylist();
		this.setState({ createPlaylistClicked: true });
	}

	renderCreatePlaylistButton() {
		let artistNames = this.props.artistNames;
		let clicked = this.props.createPlaylistClicked;
		if (artistNames !== undefined && artistNames.length > 0 && !clicked) {
			return (
				<CreatePlaylistButton createPlaylist={this.createPlaylist}/>
			);
		}
	}

	render() {
		return (
			<div className="ArtistTable">
				{this.renderArtists()}
				{this.renderCreatePlaylistButton()}
			</div>
		);
	}
}

export default ArtistTable;
