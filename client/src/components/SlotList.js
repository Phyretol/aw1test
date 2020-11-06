import React from 'react';
import ExamAPI from '../api/ExamAPI';

import {Redirect} from 'react-router-dom';
const moment = require('moment');

//lista degli slot disponibili da prenotare per lo studente
class SlotList extends React.Component {
    constructor(props){
        super(props);
        this.state = {slots : [], submit: false};
    }

    componentDidMount(){
        const exam = this.props.exam;

        ExamAPI.getSlots(exam).then((slots) => {
            this.setState({slots : slots});
        }).catch((errorObj)=>{this.handleErrors(errorObj)});
    }

    handleErrors = (err) => { console.log(err);}

    updateSelectedSlot = (event) => {
        this.setState({selectedSlot: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const slot = this.state.selectedSlot;
        if(slot) {
            const reservation = {
                slot: slot,
                student: this.props.student
            }
            
            ExamAPI.addReservation(reservation)
            .then(() => this.setState({submitted: true}))
            .catch((err) => this.handleErrors(err));
        }
    }

    render(){
        if (this.state.submitted)
            return <Redirect to={'/exams/' + this.props.exam} />;
        return <form className="form col-4" onSubmit={(event) => this.handleSubmit(event)}>
            <h4>Prenotazione test</h4>
            <select class="custom-select custom-select-lg" value={this.state.selectedSlot} onChange={(ev) => this.updateSelectedSlot(ev)}>
                <option>Seleziona uno slot</option>
                {this.state.slots.map((slot, index) => (
                    <option key={slot.id} value={slot.id} required>{moment(slot.start).format('DD/MM, HH:mm')}</option>
                ))}
            </select>
            <button className="btn btn-primary" type="submit">Invia</button>
        </form>
    }
}

export default SlotList;