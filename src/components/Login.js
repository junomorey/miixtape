import React, { Component } from 'react';
import '../style/Login.css';

class Login extends Component {
	constructor(props){
		super(props);
	}

	render() {
		return (
			<div className="Login">
				<button type="button" className="btn btn-outline-success">
					<a href='http://localhost:8888/login'>Login with Spotify</a>
				</button>
			</div>
		);
	}
};

export default Login;