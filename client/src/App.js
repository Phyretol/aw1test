import React from 'react';
import logo from './logo.svg';
import './App.css';
import API from './api/API';
import {Redirect, Route,Link} from 'react-router-dom';
import {Switch} from 'react-router';
import {AuthContext} from './auth/AuthContext';
import { withRouter } from 'react-router-dom';
import Collapse from 'react-bootstrap/Collapse';

import Header from './components/Header';
import LoginForm from "./components/LoginForm"
import Board from './components/Board';
import SharedBoards from './components/SharedBoards'
import ExampleBoard from './components/ExampleBoard';
import BoardList from './components/BoardList';

class App extends React.Component {
  
    constructor(props)  {
        super(props);
        this.state = {};
    }
  
    componentDidMount() {
        //check if the user is authenticated
        API.isAuthenticated().then(
            (user) => {
            this.setState({authUser: user});
            }
        ).catch((err) => { 
            this.setState({authErr: err.errorObj});
            this.props.history.push("/login");
        });
    }
  
    handleErrors(err) {
        if (err) {
            if (err.status && err.status === 401) {
                this.setState({authErr: err.errorObj});
                this.props.history.push("/login");
            }
        }
    }
  
    // Add a logout method
    logout = () => {
        API.userLogout().then(() => {
            this.setState({authUser: null, authErr: null});
        });
    }
  
    // Add a login method
    login = (username, password) => {
        API.userLogin(username, password).then((user) => {
            this.setState({authUser: user, authErr: null}); 
        }).catch((errorObj) => {
            const err0 = errorObj.errors[0];
            this.setState({authErr: err0});
        });
    }

    render(){
        const value = {
            authUser: this.state.authUser,
            authErr: this.state.authErr,
            loginUser: this.login,
            logoutUser: this.logout
          }
          return(<AuthContext.Provider value={value}>
            <Header/>
            <Switch>
                <Route path="/home">
                    {!(value.authUser) && <ExampleBoard/>}
                    {(value.authUser) && <BoardList/>}
                </Route>

                <Route path="/login">
                    <LoginForm/>
                </Route>

                <Route path='/boards/:id' render={(props) => {
                    return (<Board boardId={props.match.params.id}/>);
                }}/>

                <Route path='/shared'>
                    <SharedBoards/>
                </Route>

                <Route>
                    <Redirect to='/home' />
                </Route>
            </Switch>
        </AuthContext.Provider>);
    }          
}

export default withRouter(App);
