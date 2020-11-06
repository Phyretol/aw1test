import React from 'react';
import logo from './logo.svg';
import './App.css';
import TeacherAPI from './api/TeacherAPI';
import {Redirect, Route,Link} from 'react-router-dom';
import {Switch} from 'react-router';
import {AuthContext} from './auth/AuthContext';
import { withRouter } from 'react-router-dom';
//import Collapse from 'react-bootstrap/Collapse';

import Header from './components/Header';
import LoginForm from './components/LoginForm';
import StudentForm from './components/StudentForm';
import ExamList from './components/ExamList';
import ExamForm from './components/ExamForm';
import ExamComponentStudent from './components/ExamComponentStudent';
import ExamComponentTeacher from './components/ExamComponentTeacher';
import SlotList from './components/SlotList';

class App extends React.Component {
  
    constructor(props)  {
        super(props);
        this.state = {};
    }
  
    componentDidMount() {
        //check if the teacher is authenticated
        TeacherAPI.isAuthenticated().then(
            (teacher) => {this.setState({teacher: teacher});}
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
        TeacherAPI.teacherLogout().then(() => {
            this.setState({teacher: null, authErr: null});
        });
    }
  
    // Add a login method
    login = (username, password) => {
        TeacherAPI.teacherLogin(username, password).then((teacher) => {
            this.setState({teacher: teacher, authErr: null, student: undefined}); 
        }).catch((errorObj) => {
            const err0 = errorObj.errors[0];
            this.setState({authErr: err0});
        });
    }

    setStudent = (studentId) => {
        this.setState({student: studentId});
    }

    render(){
        const value = {
            teacher: this.state.teacher,
            authErr: this.state.authErr,
            loginTeacher: this.login,
            logoutTeacher: this.logout,
            setStudent: this.setStudent,
            student: this.state.student
        }
        return(<AuthContext.Provider value={value}>
            <Header/>
            <Switch>
                <Route path='/home'>
                    <StudentForm setStudent={this.setStudent}/>
                </Route>

                <Route exact path='/exams/'>
                    {!(this.state.student || this.state.teacher) && <Redirect to='/home'/>}
                    {this.state.student && <ExamList student={this.state.student}/>}
                    {this.state.teacher && <>
                    <Link to='/create'>Nuovo esame</Link>
                    <ExamList course={this.state.teacher.course}/></>}
                </Route>

                <Route path="/login">
                    <LoginForm/>
                </Route>

                <Route path='/exams/:exam'render={(props) => {
                    return <>
                        {!(this.state.student || this.state.teacher) && <Redirect to='/home' />}
                        {this.state.student && <ExamComponentStudent exam={props.match.params.exam} student={this.state.student}/>}
                        {this.state.teacher && <ExamComponentTeacher exam={props.match.params.exam} teacher={this.state.teacher}/>}
                    </>;
                }}/>

                <Route exact path='/create/'>
                    {!(this.state.teacher) && <Redirect to='/login' />}
                    {this.state.teacher && <ExamForm teacher={this.state.teacher}/>}
                </Route>

                <Route path='/slots/:exam' render={(props) => {
                    return <>
                        {!(this.state.student) && <Redirect to='/home' />}
                        <SlotList exam={props.match.params.exam} student={this.state.student}/>
                    </>;
                }}/>

                <Route>
                    <Redirect to='/home'/>
                </Route>
            </Switch>
        </AuthContext.Provider>);
    }          
}

export default withRouter(App);
