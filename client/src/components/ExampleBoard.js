import React from 'react';
import API from '../api/API';
import {Link} from "react-router-dom";

const columns = ["Da fare", "In corso", "Completato"];
const cards = [
    [
        {
            title : "Lezioni programmazione",
            description : "Studio del materiale e correzione degli esercizi",
            links : [],
            position : 0
        }
    ],
    [
        {
            title : "Testo tesi big data",
            description : "Stesura documento e verifica delle fonti",
            links : ["https://it.wikipedia.org/wiki/Big_data"],
            position : 0
        }
    ],
    [
        {
            title : "Software gestione reti",
            description : "Revisione del codice e correzione bug",
            links : [],
            position : 0
        },
        {
            title : "Sito web negozio",
            description : "Consegnato al cliente",
            links : [],
            position : 1
        }
    ]
];

const Column = (props) => {
    let {column, cards} = props;

    return <div class="col">
        <h3 className="text-center">{column}</h3>
        {cards.map((c) => <Card card={c}></Card>)}
    </div>
}

class ExampleBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {columns : columns, cards : cards};
    }

    componentDidMount(){
        /*API.getBoard(this.props.boardId).then((board) => {
            let cards = [];
            for(let i=0; i<rows; i++) {
                for(let j=0; j<board.columns.length; j++)
                    cards[i][j] = null;
            }
            board.cards.forEach(c => cards[c.row][c.column] = c);
            this.setState({name : board.name, columns : board.columns, cards : cards});
        }).catch(err => this.handleErrors(err));*/

        /*API.getBoard(this.props.boardId).then((board) => {
            let cardMatrix = [];
            for(let i=0; i<rows; i++) {
                for(let j=0; j<board.columns.length; j++)
                    cardMatrix[i][j] = null;
            }
            board.cards.forEach(c => cardMatrix[c.row][c.column] = c);
            this.setState({name : board.name, columns : board.columns, cards : cardMatrix});
        }).catch(err => this.handleErrors(err));*/
    }

    handleErrors(err) {

    }

    render() {

        return <div>
            <h1 className="row">Kanban Board</h1>
            <div className="row">
                {columns.map((c, i) => <Column column={c} cards={cards[i]}/>)}
            </div>
            <p className="row"><Link to="/login">Collegati</Link> per creare la tua board</p>
        </div>
    }
}

const Card = (props) => {
    let {card} = props;

    return <div className="card" style={{backgroundColor : "lightyellow", paddingBottom : "15px"}}>
        <div className="card-body">
            <h4 className="card-title">{card.title}</h4>
            <p className="card-text">{card.description}</p>
            {card.links.map(l => <a href={l} className="card-link">{l}</a>)}
        </div>
    </div>
}

/*class Card extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {title : props.title, description : props.description, expiryDate : props.expiryDate, links : props.links };
    }

    render() {
        
        return <div className="card" style={{backgroundColor : "lightyellow"}}>
            <div className="card-body">
                <h4 className="card-title">{this.state.title}</h4>
                <p className="card-text">{this.state.description}</p>
                {this.state.links.map(l => <a href={l} className="card-link">{l}</a>)}
            </div>
        </div>
    }
}*/

export default ExampleBoard;