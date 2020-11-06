import React from 'react';
import ExamAPI from '../api/ExamAPI';

import {Link} from "react-router-dom";

//lista dei link per accedere ai singoli esami, da collocare nella pagina home
class ExamList extends React.Component {
    constructor(props){
        super(props);
        this.state = {exams : []};
    }

    componentDidMount(){
        const student = this.props.student;
        const course = this.props.course;

        if(student) {
            ExamAPI.getExamsByStudent(student).then((exams) => {
                this.setState({exams : exams});
            }).catch((errorObj)=>{this.handleErrors(errorObj)});
        } else {
            ExamAPI.getExamsByCourse(course).then((exams) => {
                this.setState({exams : exams});
            }).catch((errorObj)=>{this.handleErrors(errorObj)});
        }
    }

    handleErrors = (err) => { console.log(err);}

    render(){
        return <ul className="list-group">{
            this.state.exams.map((exam, index) => (
                <Link key={exam.id}  to={"/exams/"+exam.id}><ul className="list-group-item list-group-item-action">{exam.courseName}</ul></Link>
            ))
        }
        </ul>
    }
}

export default ExamList;