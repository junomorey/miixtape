import React, { Component } from 'react';
import {MAX_ARTISTS} from '../js/constants';
import '../style/Input.css';

class SearchBar extends Component {
	constructor(props){
		super(props);
		this.state = { 
			text: '',
		};
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.addArtist = this.addArtist.bind(this);
	}

	addArtist() {
		this.props.addArtist(this.state.text);
		this.setState({ nextArtistNum: this.state.nextArtistNum + 1 });
	}

	handleUpdate(event) {
		this.setState({ text: event.target.value });
	}

	handleKeyPress(event) {
		if (event.key === 'Enter' && this.state.text) {
			this.addArtist();
			this.setState({ text: '' })
		}
	}

	artistPlaceHolder() {
		if (this.props.nextArtistNum === MAX_ARTISTS + 1) {
			return '(' + MAX_ARTISTS.toString() + ' Artist Maximum)' 
		} else {
			return "Artist " + this.props.nextArtistNum.toString();
		}
	}

	render() {
		return (
			<div>
				<input className="Input" 
					type="text" 
					placeholder={this.artistPlaceHolder()}
					onKeyPress={this.handleKeyPress}
					onChange={this.handleUpdate} 
					value={this.state.text} />
			</div>
		);
	}
};

export default SearchBar;