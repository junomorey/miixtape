import React, { Component } from 'react';
import {MAX_TITLE_LENGTH} from '../js/constants';
import '../style/Input.css';

class TitleInput extends Component {
	constructor(props){
		super(props);
		this.state = { text: ''};
		this.handleUpdate = this.handleUpdate.bind(this);
	}

	handleUpdate(event) {
		if (event.target.value.length < MAX_TITLE_LENGTH) {
			this.setState({ text: event.target.value }, () => (
				this.props.updateTitle(this.state.text)
			));
		}
	}

	render() {
		return (
			<div className="Input">
				<input
					type="text"
					placeholder="Type the mixtape name."
					onChange={this.handleUpdate}
					value={this.state.text}
					autoFocus
				/>
			</div>
		);
	}
};

export default TitleInput;