import React, { Component } from 'react';
import '../style/CreatePlaylistButton.css';

class CreatePlaylistButton extends Component {
	constructor(props){
		super(props);
		this.createPlaylist = this.createPlaylist.bind(this)
	}

	createPlaylist(event) {
		this.props.createPlaylist();
	}
	
	render() {
		return (
			<div className="CreatePlaylistButton">
				<button className="btn btn-outline-secondary" onClick={this.createPlaylist}>Create Playlist</button>
			</div>
		);
	}
};

export default CreatePlaylistButton;