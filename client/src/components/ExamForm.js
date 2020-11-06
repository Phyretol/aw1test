import React from 'react';
import {Redirect} from 'react-router-dom';
import ExamAPI from '../api/ExamAPI';

const moment = require('moment');

class Session {
    constructor(date, startTime, duration) {
        this.start = moment(date + ' ' + startTime);
        this.end = moment(this.start).add(duration, 'minutes');
    }

    overlaps = (session) => {
        return (this.start.isBefore(session.end) && this.end.isAfter(session.start));
    }

    slots = (slotDuration) => {
        const slots = [];
        let slotStart = moment(this.start), slotEnd = moment(this.start);

        do {
            slotEnd.add(slotDuration, 'minutes');
            let slot = {
                start: moment(slotStart),
                end: moment(slotEnd)
            }
            slots.push(slot);
            slotStart.add(slotDuration, 'minutes');
        } while(slotEnd.isBefore(this.end));
        return slots;
    }

    text = () => {
        return this.start.format('DD/MM, HH:mm') + ' - ' + this.end.format('DD/MM, HH:mm');
    }
}

//form per la creazione di un nuovo esame
class ExamForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {step: 1, students: [], studentChecks: [], selectedStudents: [], studentSelectWarning: false, sessions: [], slots: [], sessionOverlapError: false, sessionFieldWarning: false, availableSlotsError: false, submitted: false};
    }

    componentDidMount() {
        ExamAPI.getStudents(this.props.teacher.course).then((students) => {
             this.setState({students: students});
             this.setChecks(students);
        }).catch((err) => this.handleErrors(err));
    }

    handleErrors = (err) => {
        console.log(err);
    }

    updateSlotDuration = (event) => {
        this.setState({slotDuration : event.target.value});
    }

    //genera array di booleani (inizialmente false = non selezionato) per ogni studente, resetta selezione
    setChecks = (students) => {
        this.setState({studentChecks: students.map(() => false), selectedStudents: []});
    }

    //funzioni per variabili del form
    updateStudentCheck = (event, index) => {
        const studentChecks = this.state.studentChecks;
        studentChecks[index] = event.target.checked;
        this.setState({studentChecks: studentChecks});
    }

    updateSessionDate = (event) => {
        this.setState({sessionDate: event.target.value});
    }

    updateSessionStartTime = (event) => {
        this.setState({sessionStartTime: event.target.value});
    }

    updateSessionDuration = (event) => {
        this.setState({sessionDuration: event.target.value});
    }

    addSession = () => {
        const date = this.state.sessionDate;
        const startTime = this.state.sessionStartTime;
        const duration = this.state.sessionDuration;
        const sessions = this.state.sessions;
        const allFields = date && startTime && duration;
        let slots = this.state.slots;
        let overlaps = false;

        if(allFields) {
            const mySession = new Session(date, startTime, duration);

            sessions.forEach(session => {
                if(mySession.overlaps(session))
                    overlaps = true;
            });
            if(!overlaps) {
                sessions.push(mySession);
                slots = slots.concat(mySession.slots(this.state.slotDuration));
            }
        }
        this.setState({slots: slots, sessions: sessions, sessionOverlapError: overlaps, sessionFieldWarning: !allFields});
    }

    getSelectedStudents = () => {
        const students = [];
        this.state.students.forEach((student, index) => {
            if(this.state.studentChecks[index])
                students.push(student);
        })
        return students;
    }
    
    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.step == 1) {
            const selectedStudents = this.getSelectedStudents();
            if(this.state.slotDuration && selectedStudents.length > 0)
                this.setState({step: 2, selectedStudents: selectedStudents});
            else
                this.setState({studentSelectWarning: true});
        } else {
            const availableSlots = this.state.slots.length - this.state.selectedStudents.length;

            if(availableSlots > 0) {
                const exam = {
                    course: this.props.teacher.course,
                    students: this.state.selectedStudents,
                    slots: this.state.slots
                }

                ExamAPI.addExam(exam).then(() => {
                    this.setState({submitted: true});
                }).catch((err) => this.handleErrors(err));
            } else
                this.setState({availableSlotsError: true})
        }
    }

    render() {
        if (this.state.submitted)
            return <Redirect to='/exams' />;
        return <form className="form col-4" onSubmit={(event) => this.handleSubmit(event)}>
            {(this.state.step == 1) && <>
                <div className="form-group">
                    <label htmlFor="slotDuration">Durata slot (minuti)</label>
                    <input type="number" className="form-control" id="slotDuration" value = {this.state.slotDuration} min={5} step={5} onChange={(ev) => this.updateSlotDuration(ev)} required autoFocus/>
                </div>
                <div>
                    {this.state.studentSelectWarning && <div class="alert alert-warning">Seleziona almeno uno studente</div>}
                    <legend>Studenti</legend>
                    {this.state.students.map((student, index) => <div className='form-check' key={student}>
                            <input className='form-check-input' type='checkbox' id={student} checked={this.state.studentChecks[index]} onChange = {(event) => {this.updateStudentCheck(event, index)}} />
                            <label className='form-check-label' htmlFor={student}>{student}</label>
                        </div>
                    )}
                </div>
                <button class="btn btn-primary" type="submit" onClick={this.next}>Avanti</button>
            </>}
            {(this.state.step == 2) && <>
                {this.state.availableSlotsError && <div class="alert alert-warning">Numero di slot non sufficiente</div>}
                <legend>Sessioni</legend>
                {this.state.sessions.map((session, index) => <p>{session.text()}</p>)}
                <p>Slot disponibili : {this.state.slots.length - this.state.selectedStudents.length}</p>
                <div>
                    {this.state.sessionFieldWarning && <div class="alert alert-warning">Compila tutti i campi</div>}
                    {this.state.sessionOverlapError && <div class="alert alert-warning">Sovrapposizione con altre sessioni</div>}
                    <legend>Nuova sessione</legend>
                    <div className="form-group">
                        <label htmlFor="date">Data</label>
                        <input type="date" className="form-control" id="date" value = {this.state.sessionDate} min={moment().format('YYYY-MM-DD')} onChange={(ev) => this.updateSessionDate(ev)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="startTime">Ora inizio</label>
                        <input type="time" className="form-control" id="startTime" value = {this.state.sessionStartTime} onChange={(ev) => this.updateSessionStartTime(ev)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="duration">Durata (minuti)</label>
                        <input type="number" className="form-control" id="duration" value = {this.state.sessionDuration} min={this.state.slotDuration} step={this.state.slotDuration} onChange={(ev) => this.updateSessionDuration(ev)}/>
                    </div>
                    <button class="btn btn-primary" type="button" onClick={this.addSession}>Aggiungi</button>
                </div>
                <button class="btn btn-primary" type="submit">Invia</button>
            </>}
        </form>;
    }
}

export default ExamForm;