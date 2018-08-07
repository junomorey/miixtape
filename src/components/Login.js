import React, { Component } from 'react';
import '../style/Login.css';

class Login extends Component {
	constructor(props){
		super(props);
	}

	handleClick(event) {

	}

	render() {
		return (
			<div className="Login">
				<button type="button" className="btn btn-outline-success">
					<a href={process.env.LOGIN_URI}>Login with Spotify</a>
				</button>
			</div>
		);
	}
};

export default Login;