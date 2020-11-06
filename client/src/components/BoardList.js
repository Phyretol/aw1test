import React from 'react';
import API from '../api/API';

import { AuthContext } from '../auth/AuthContext';
import Collapse from 'react-bootstrap/esm/Collapse';
import {Link} from "react-router-dom";

class BoardList extends React.Component {
    constructor(props){
        super(props);
        this.state = {boards : [], name : ""};
    }

    componentDidMount(){
        API.getBoards().then((boards) => {
            this.setState({boards : boards});
        }).catch((errorObj)=>{this.handleErrors(errorObj)});
    }

    onDelete = (boardId) => {
        API.deleteBoard(boardId).then(() => {
            API.getBoards().then((boards) => {
                this.setState({boards : boards, name : ""});
            })
        }).catch((errorObj)=>{this.handleErrors(errorObj)});
    }

    onCreate = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) 
            form.reportValidity();
        else {
            API.createBoard(this.state.name).then(() => {
                API.getBoards().then((boards) => {
                    this.setState({boards : boards});
                })
            }).catch((errorObj)=>{this.handleErrors(errorObj)});
        }
    }

    onChangeName = (event) => {
        this.setState({name : event.target.value});
    }

    handleErrors = (err) => { console.log(err);}

    render(){
        const BoardListRow = (props) => {
            let {boardId, name, cardCount, expiredCardCount, onDelete} = props;
    
            return <tr>
                <td>{name}</td>
                <td>{cardCount}</td>
                <td>{expiredCardCount}</td>
                <td><Link to={"/boards/"+boardId}><button>Modifica</button></Link></td>
                <td><button onClick={() => this.onDelete(boardId)}>Elimina</button></td>
            </tr>;
        }

        return <div>
            <table className='table' style={{marginBottom: 0}}>
                <thead>
                <tr>
                    <th className=''>Nome</th>
                    <th className=''>Schede</th>
                    <th className=''>Schede Scadute</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>{
                    this.state.boards.map((b, i) => (
                        <BoardListRow key={i} boardId={b.boardId} name={b.name} cardCount={b.cardCount} expiredCardCount={b.expiredCardCount} onDelete={this.props.onDelete}/>
                    ))
                }
                </tbody>
            </table>
            <h4>Crea una Board</h4>
            <form className="form" onSubmit={(event) => this.onCreate(event)}>
                <div className="form-group">
                    <label htmlFor="name">Nome utente</label>
                    <input type="text" className="form-control" id="name" value = {this.state.name} onChange={(ev) => this.setState({name : ev.target.value})} required autoFocus/>
                </div>

                <button class="btn btn-primary" type="submit">Invia</button>

            </form>
        </div>
    }
}

export default BoardList;