import React from 'react';
import {Redirect} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext'

//form per il collegamento del docente
class LoginForm extends React.Component {   
    constructor(props) {
        super(props);
        this.state = {username: '', password: '', submitted: false};
    }

    onChangeUsername = (event) => {
        this.setState({username : event.target.value});
    }; 
    
    onChangePassword = (event) => {
        this.setState({password : event.target.value});
    };
    
    handleSubmit = (event, login) => {
        event.preventDefault();
        login(this.state.username, this.state.password);
        this.setState({submitted : true});
    }

    render() {
        if (this.state.submitted)
            return <Redirect to='/exams' />;
        return(<AuthContext.Consumer>
            {(context) => (
                <>
                {context.teacher && <Redirect to = "/exams"/>}
                
                <form className="form col-4" onSubmit={(event) => this.handleSubmit(event, context.loginTeacher)}>
                <h4>Accesso docenti</h4>
                    <div className="form-group">
                        <label htmlFor="username">Nome utente</label>
                        <input type="text" className="form-control" id="username" value = {this.state.username} onChange={(ev) => this.onChangeUsername(ev)} required autoFocus/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" value = {this.state.password} onChange={(ev) => this.onChangePassword(ev)} required/>
                    </div>
                    <button className="btn btn-primary" type="submit">Invia</button>
                </form>
                </>)}
        </AuthContext.Consumer>);
    }
}

export default LoginForm;