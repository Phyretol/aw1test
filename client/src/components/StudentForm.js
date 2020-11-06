import React from 'react';
import {AuthContext} from '../auth/AuthContext'
import { Redirect } from 'react-router';


//form per la selezione dello studente
class StudentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {submitted: false};
    }

    onChangeStudent = (event) => {
        this.setState({student : event.target.value});
    }; 
    
    handleSubmit = (event, setStudent) => {
        event.preventDefault();
        this.props.setStudent(this.state.student);
        this.setState({submitted : true});
    }

    render() {
        if(this.state.submitted)
            return <Redirect to="/exams"/>;
        return <AuthContext.Consumer>
            {(context) => (
            <form className="form-inline col-3" onSubmit={(event) => this.handleSubmit(event)}>
                <h4>Portale scolastico</h4>
                {!(context.teacher) && <>
                <div className="form-group">
                    <input type="text" className="form-control" id="student" placeholder="Matricola studente" value = {this.state.student} onChange={(ev) => this.onChangeStudent(ev)} required autoFocus/>
                </div>
                <button className="btn btn-primary" type="submit">Invia</button></>}
            </form>)}
        </AuthContext.Consumer>
    }
}

export default StudentForm;