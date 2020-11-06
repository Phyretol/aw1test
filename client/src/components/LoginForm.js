import React from 'react';
import {Redirect} from 'react-router-dom';

import {AuthContext} from '../auth/AuthContext'

class LoginForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {username: '', password: '', submitted: false};
    }

    onChangeUsername = (event) => {
        this.setState({email : event.target.value});
    }; 
    
    onChangePassword = (event) => {
        this.setState({password : event.target.value});
    };
    
    handleSubmit = (event, onLogin) => {
        event.preventDefault();
        onLogin(this.state.email,this.state.password);
        this.setState({submitted : true});
    }

    render() {
        if (this.state.submitted)
            return <Redirect to='/' />;
        return(<AuthContext.Consumer>
            {(context) => (
                <>
                {context.authUser && <Redirect to = "/home"/>}
                <form className="form" onSubmit={(event) => this.handleSubmit(event, context.loginUser)}>
                    <div className="form-group">
                        <label htmlFor="email">Nome utente</label>
                        <input type="text" className="form-control" id="email" value = {this.state.email} onChange={(ev) => this.onChangeUsername(ev)} required autoFocus/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" value = {this.state.password} onChange={(ev) => this.onChangePassword(ev)} required/>
                    </div>

                    <button class="btn btn-primary" type="submit">Invia</button>

                </form>
                </>)}
        </AuthContext.Consumer>);
    }

}

export default LoginForm;