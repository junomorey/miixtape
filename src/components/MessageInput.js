import React, { Component } from 'react';
import '../style/Input.css';
import {MAX_MESSAGE_LENGTH} from '../js/constants';

class MessageInput extends Component {
	constructor(props){
		super(props);
		this.state = { text: '' };
		this.handleUpdate = this.handleUpdate.bind(this);
	}

	handleUpdate(event) {
		if (event.target.value.length < MAX_MESSAGE_LENGTH) {
			this.setState({ text: event.target.value }, () => (
				this.props.updateMessage(this.state.text)
			));
		}
	}
	
	render() {
		return (
			<div className="Input">
				<input
				 	type="text"
				 	placeholder="Type the mixtape message."
					onChange={this.handleUpdate}
					value={this.state.text}
				/>
			</div>
		);
	}
};

export default MessageInput;