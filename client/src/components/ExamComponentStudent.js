import React from 'react';
import ExamAPI from '../api/ExamAPI';

import {Link} from "react-router-dom";

const moment = require('moment');

class ExamComponentStudent extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount(){
        const student = this.props.student;
        const id = this.props.exam;

        ExamAPI.getStudentExam(id, student)
        .then((exam) => this.setState({exam: exam}))
        .catch((err) => this.handleErrors(err));
    }

    handleErrors = (err) => { console.log(err);}

    numberToGrade = (grade) => {
        if(grade > 30)
            return '30L';
        if(grade >= 18)
            return grade;
        if(grade > 0)
            return 'Insufficiente';
        else
            return 'Ritirato';
    }

    render() {
        let link = <></>, reservationDisplay = <></>, resultDisplay = <></>
        const exam = this.state.exam;
        if(exam) {
            const reservation = exam.reservation, result = exam.result;
            if(result) {
                resultDisplay = <div>
                    <h4>Risultato</h4>
                    {(result.absent) && <p>Assente</p>}
                    {!(result.absent) && <p>Voto : {this.numberToGrade(result.grade)}</p>}
                </div>
            } else {
                if(reservation) {
                    reservationDisplay = <div>
                        <h4>Slot prenotato</h4>
                        <p>Inizio : {moment(reservation.slot.start).format('DD/MM HH:mm')} Fine : {moment(reservation.slot.end).format('DD/MM HH:mm')}</p>
                    </div>
                } else 
                    link = <Link to={'/slots/' + this.props.exam}>Prenota test</Link>
            }
        }
        return <div>
            {resultDisplay}
            {reservationDisplay}
            {link}
        </div>
    }
}

export default ExamComponentStudent;