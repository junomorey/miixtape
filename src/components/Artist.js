import React, { Component } from 'react';
import '../style/Artist.css';
import '../style/ArtistName.css'

class Artist extends Component {
	constructor(props){
		super(props);
		this.removeArtist = this.removeArtist.bind(this);
	}

	removeArtist() {
		this.props.removeArtist(this.props.name);
	}

	render() {
		return (
			<div className="Artist">
				<button className="btn btn-outline-danger" onClick={this.removeArtist}>Remove</button>
				<span className="ArtistName">
					{this.props.name}
				</span>
			</div>
		);
	}
};

export default Artist;