import React, { Component } from 'react';
import '../style/Input.css';

class TitleInput extends Component {
	constructor(props){
		super(props);
		this.state = { text: ''};
		this.handleUpdate = this.handleUpdate.bind(this);
	}

	handleUpdate(event) {
		this.setState({ text: event.target.value }, () => (
			this.props.updateTitle(this.state.text)
		));
	}

	render() {
		return (
			<div className="Input">
				<input
					type="text"
					placeholder="Mixtape name"
					onChange={this.handleUpdate}
					value={this.state.text}
					autoFocus
				/>
			</div>
		);
	}
};

export default TitleInput;