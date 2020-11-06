import React from 'react';
import ExamAPI from '../api/ExamAPI';

import {Redirect} from "react-router-dom";

const moment = require('moment');

class GradeComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {absent: false, grade: "", insufficient: false, withdraw: false, lode: false};
    }

    updateAbsent = (event) => {
        const absent = event.target.checked;
        this.setState({absent: absent});
        this.setState({withdraw: false, grade: "", insufficient: false, lode: false});
    }

    updateWithdraw = (event) => {
        const withdraw = event.target.checked;
        this.setState({withdraw: withdraw, grade: "", insufficient: false, lode: false});
    }

    updateInsufficient = (event) => {
        const insufficient = event.target.checked;
        this.setState({insufficient: insufficient, grade: "", lode: false});
    }

    updateGrade = (event) => {
        const grade = event.target.value;
        this.setState({grade: grade, insufficient: false});
        if(grade < 30 && this.state.lode)
            this.setState({lode: false});
    }

    updateLode = (event) => {
        this.setState({lode: event.target.checked});
    }

    handleErrors = (err) => { console.log(err); }

    handleSubmit = (event) => {
        event.preventDefault();
        const result = {
            exam: this.props.exam,
            student: this.props.student,
            absent: this.state.absent,
            grade: this.gradeToNumber()
        }

        ExamAPI.addResult(result)
        .then(() => this.setState({submitted: true}))
        .catch((err) => this.handleErrors(err));
    }

    gradeToNumber = () => {
        if(this.state.absent || this.state.withdraw)
            return -1;
        else if(this.state.insufficient)
            return 0;
        else if(this.state.lode)
            return 31;
        else
            return this.state.grade;
    }

    render() {
        if(this.state.submitted)
            return <Redirect to='/exams'/>
        return <form className="form col-4" onSubmit={(event) => this.handleSubmit(event)}>
            <div className='form-check'>
                <input className='form-check-input' type='checkbox' id='absent' checked={this.state.absent} onChange = {(event) => {this.updateAbsent(event)}} />
                <label className='form-check-label' htmlFor='absent'>Assente</label>
            </div>
            <div className='form-check'>
                    <input className='form-check-input' type='checkbox' id='withdraw' checked={this.state.withdraw} onChange = {(event) => {this.updateWithdraw(event)}} disabled={this.state.absent}/>
                    <label className='form-check-label' htmlFor='withdraw'>Ritirato</label>
                </div>
            <fieldset disabled={(this.state.absent || this.state.withdraw)}>
                <div className='form-check'>
                    <input className='form-check-input' type='checkbox' id='insufficient' checked={this.state.insufficient} onChange = {(event) => {this.updateInsufficient(event)}} />
                    <label className='form-check-label' htmlFor='insufficient'>Insufficiente</label>
                </div>
                <div className='form-control'>
                    <input className='form-control-input' type='number' min='18' id='grade' value={this.state.grade} onChange={(event) => this.updateGrade(event)} />
                    <label className='form-control-label' htmlFor='grade'>Voto</label>
                </div>
                <div className='form-check'>
                    <input className='form-check-input' type='checkbox' id='lode' checked={this.state.lode} onChange = {(event) => {this.updateLode(event)}} disabled={(this.state.grade < 30)} />
                    <label className='form-check-label' htmlFor='lode'>Lode</label>
                </div>
            </fieldset>
            <button class="btn btn-primary" type="submit">Invia</button>
        </form>
    }
}

class ExamComponentTeacher extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount(){
        const id = this.props.exam;

        ExamAPI.getExam(id)
        .then((exam) => this.setState({exam: exam}))
        .catch((err) => this.handleErrors(err));
    }

    handleErrors = (err) => { console.log(err);}

    numberToGrade = (grade) => {
        if(grade > 30)
            return '30L';
        if(grade >= 18)
            return grade;
        if(grade >= 0)
            return 'Insufficiente';
        else
            return 'Ritirato';
    }

    select = (student) => {
        this.setState({selectedStudent: student})
    }

    render() {
        return <div>
            {this.state.selectedStudent && <GradeComponent exam={this.props.exam} student={this.state.selectedStudent}/>}
            {(this.state.exam && !(this.state.selectedStudent)) && <>
                <div>
                    <h4>Prenotazioni</h4>
                    <table className='table'>
                        <tr>
                            <th>Studente</th>
                            <th>Inizio</th>
                            <th>Fine</th>
                            <th></th>
                        </tr>
                        {this.state.exam.reservations.map((reservation) => <tr>
                            <td>{reservation.student}</td>
                            <td>{reservation.slot && moment(reservation.slot.start).format('DD/MM HH:mm')}</td>
                            <td>{reservation.slot && moment(reservation.slot.end).format('DD/MM HH:mm')}</td>
                            <td>{reservation.slot && <button type='button' className="btn btn-primary" onClick={() => this.select(reservation.student)}>Valutazione</button>}</td>
                        </tr>)}
                    </table>
                </div>
                <div>
                    <h4>Risultati</h4>
                    <table className='table'>
                        <tr>
                            <th>Studente</th>
                            <th>Assente</th>
                            <th>Voto</th>
                        </tr>
                        {this.state.exam.results.map((result) => <tr>
                            <td>{result.student}</td>
                            <td>{(result.absent) ? 'Sì' : 'No'}</td>
                            <td>{!(result.absent) && this.numberToGrade(result.grade)}</td>
                        </tr>)}
                    </table>
                </div>
            </>}
        </div>
    }
}

export default ExamComponentTeacher;