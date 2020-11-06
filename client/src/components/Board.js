import React from 'react';
import API from '../api/API';
import {Link} from "react-router-dom";
import {Modal} from "react-bootstrap"

class Board extends React.Component {
    constructor(props) {
        super(props);

        this.state = {columns : [], cards : [], archivedCards : [], editColumn : {}, editCard : {}, editLinks : {}, 
        editing1 : false, editing2 : false};
    }

    setEditColumn = (column) => { this.setState({editColumn : column, editing1 : true}); }
    setEditCard = (card, links) => { this.setState({editCard : card, editing2 : true}); }

    closeModal1 = () => {this.setState({editing1 : false});}
    closeModal2 = () => {this.setState({editing2 : false});}

    componentDidMount(){
        this.loadAll();
    }

    handleErrors = (err) => {

    }

    onCreateColumn = () => {
        API.createColumn(this.props.boardId)
        .then(() => this.loadColumns())
        .catch((err) => this.handleErrors(err));
    }

    loadAll = () => {
        API.getColumns(this.props.boardId).then((columns) => {
            columns.sort((c1, c2) => c1.position-c2.position);
            columns.forEach((c, i) => c.index = i);
            this.setState({columns : columns}, () => this.loadAllCards());
        }).catch(err => this.handleErrors(err));
    }

    loadCards = (column) => {
        API.getCards(column.columnId)
        .then((cards) => {
            console.log({id : column.columnId, cards : cards});
            let colCards = [];
            let archivedCards = [];

            cards.forEach((c) => {
                c.column = column;
                if(c.position < 0)
                    archivedCards.push(c);
                else
                    colCards.push(c);
            });
            colCards.sort((c1, c2) => c1.position-c2.position);
            colCards.forEach((c, i) => c.index = i);

            let myCards = this.state.cards;
            let myArchivedCards = this.state.archivedCards;

            myCards[column.index] = colCards;
            myArchivedCards[column.index] = archivedCards;
            this.setState({cards : myCards, archivedCards : myArchivedCards});
            console.log(myCards);
        }).catch(errorObj => this.handleErrors(errorObj));
    }

    loadColumns = () => {
        API.getColumns(this.props.boardId).then((columns) => {
            columns.sort((c1, c2) => c1.position-c2.position);
            columns.forEach((c, i) => c.index = i);
            this.setState({columns : columns});
        }).catch(err => this.handleErrors(err));
    }

    loadAllCards = () => {
        this.state.columns.forEach((c) => this.loadCards(c));
    }

    moveLeft = (card, column) => { 
        const index = column.index;
        if(index > 0){
            card = Object.assign({}, card);
            const leftColumn = this.state.columns[index-1];
            card.columnId = leftColumn.columnId;

            API.updateCard(card).then(() => {
                this.loadAllCards();
            }).catch((errorObj) => this.handleErrors(errorObj));
        }
    }

    moveRight = (card, column) => { 
        const index = column.index;
        if(index < this.state.columns.length-1){
            card = Object.assign({}, card);
            const rightColumn = this.state.columns[index+1];
            card.columnId = rightColumn.columnId;

            API.updateCard(card).then(() => {
                this.loadAllCards();
            }).catch((errorObj) => this.handleErrors(errorObj));
        }
    }

    onChangeColumnTitle = (event) => {
        const value = event.target.value;
        const editColumn = this.state.editColumn;
        editColumn.title = value;
        this.setState({editColumn : editColumn});
    }

    onUpdateColumn = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) 
            form.reportValidity();
        else {
            API.updateColumn(this.state.editColumn)
            .then(() => this.loadColumns())
            .catch((err) => this.handleErrors);
        }
    }

    onChangeCardTitle = (event) => {
        const value = event.target.value;
        const editCard = this.state.editCard;
        editCard.title = value;
        this.setState({editCard : editCard});
    }

    onChangeCardDescription = (event) => {
        const value = event.target.value;
        const editCard = this.state.editCard;
        editCard.description = value;
        this.setState({editCard : editCard});
    }

    onChangeCardExpiryDate= (event) => {
        const value = event.target.value;
        const editCard = this.state.editCard;
        editCard.expiryDate = value;
        this.setState({editCard : editCard});
    }

    onUpdateCard = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) 
            form.reportValidity();
        else {
            const card = this.state.editCard;
            API.updateCard(card)
            .then(() => this.loadCards(card.column))
            .catch((err) => this.handleErrors);
        }
    }

    onAddColumn = () => {
        API.createColumn(this.props.boardId)
        .then(() => {
            this.loadColumns();
            this.loadAllCards();
        }).catch((err) => this.handleErrors);
    }

    render() {
        return <div>
            <Modal show={this.state.editing1} onHide={this.closeModal1} >
                <Modal.Header closeButton>
                    <Modal.Title>Modifica colonna</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form className="form" onSubmit={(event) => this.onUpdateColumn(event)}>

                        <div className="form-group">
                            <label htmlFor="title">Titolo</label>
                            <input type="text" className="form-control" id="title" value = {this.state.editColumn.title} onChange={(ev) => this.onChangeColumnTitle(ev)} required autoFocus/>
                        </div>
                        <button class="btn btn-primary" type="submit">Salva</button>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={this.state.editing2} onHide={this.closeModal2} >
                <Modal.Header closeButton>
                    <Modal.Title>Modifica scheda</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form className="form" onSubmit={(event) => this.onUpdateCard(event)}>
                        <div className="form-group">
                            <label htmlFor="title">Titolo</label>
                            <input type="text" className="form-control" id="title" value = {this.state.editCard.title} onChange={(ev) => this.onChangeCardTitle(ev)} required autoFocus/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Descrizione</label>
                            <input type="text" className="form-control" id="description" value = {this.state.editCard.description} onChange={(ev) => this.onChangeCardDescription(ev)} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="expiryDate">Scadenza</label>
                            <input type="date" className="form-control" id="expiryDate" value = {this.state.editCard.expiryDate} onChange={(ev) => this.onChangeCardExpiryDate(ev)} />
                        </div>
                        <button class="btn btn-primary" type="submit">Salva</button>
                    </form>
                </Modal.Body>
            </Modal>
            
            <div class="btn-group">
                <button className="row btn btn-secondary" onClick={() => this.onAddColumn()}>Nuova colonna</button>
                <button className="row btn btn-secondary" onClick={() => this.onAddColumn()}>Condividi</button>
            </div>
            <div class="row">
                {this.state.columns.map((c, i) => <Column column={c} cards={this.state.cards[i]} archivedCards={this.state.archivedCards[i]} 
                loadColumns={this.loadColumns} loadCards={this.loadCards} loadAllCards={this.loadAllCards} loadAll={this.loadAll} moveLeft={this.moveLeft} moveRight={this.moveRight} 
                setEditColumn={this.setEditColumn} setEditCard={this.setEditCard}/>)}
            </div>
        </div>
    }
}

class Column extends React.Component {
    constructor(props) {
        super(props);
    }

    onCreateCard = () => {
        const column = this.props.column;
        API.createCard(column.columnId).then(() => this.props.loadCards(column))
        .catch((errorObj) => this.handleErrors(errorObj));
    }

    onDelete = () => {
        const column = this.props.column;
        API.deleteColumn(column.columnId)
        .then(() => this.props.loadAll())
        .catch((errorObj) => this.handleErrors(errorObj));
    }

    archiveCard = (card) => {
        card = Object.assign({}, card);
        card.position = -1;
        API.updateCard(card).then(() => {
            this.props.loadCards(this.props.column);
        }).catch((errorObj) => this.handleErrors(console.error()));
    }

    extractCard = (card) => {
        card = Object.assign({}, card);
        const cards = this.props.cards;
        if(cards && cards.length > 0)
            card.position = cards[cards.length-1].position+1;
        else
            card.position = 0;
        API.updateCard(card).then(() => {
            this.props.loadCards(this.props.column);
        }).catch((errorObj) => this.handleErrors(console.error()));
    }

    moveUp = (card) => { 
        const index = card.index;
        const cards = this.props.cards;
        if(index > 0){
            card = Object.assign({}, card);
            const upperCard = Object.assign({}, cards[index-1]);

            const temp = upperCard.position;
            upperCard.position = card.position;
            card.position = temp;
            API.updateCard(upperCard)
            .then(API.updateCard(card)
            .then(() => this.loadCards()))
            .catch((errorObj) => this.handleErrors(errorObj));
        }
    }

    moveDown = (card) => { 
        const index = card.index;
        const cards = this.props.cards;
        if(index < cards.length-1){
            card = Object.assign({}, card);
            const lowerCard = Object.assign({}, cards[index+1]);

            const temp = lowerCard.position;
            lowerCard.position = card.position;
            card.position = temp;
            API.updateCard(lowerCard)
            .then(API.updateCard(card)
            .then(() => this.loadCards()))
            .catch((errorObj) => this.handleErrors(errorObj));
        }
    }

    moveLeft = (card) => {
        this.props.moveLeft(card, this.props.column);
    }

    moveRight = (card) => {
        this.props.moveRight(card, this.props.column);
    }

    loadCards = () => {
        this.props.loadCards(this.props.column);
    }

    onEdit = () => {
        const column = Object.assign({}, this.props.column);
        this.props.setEditColumn(column);
    }

    handleErrors = (errorObj) => {

    }
    
    render() {
        return <div className="col">
            <div className="btn-group">
                <button className="btn btn-primary" data-toggle="modal" data-target="#editColumnModal" onClick={() => this.onEdit()}>Modifica</button>
                <button className="btn btn-secondary" onClick={() => this.onDelete()}>Elimina</button>
                <button className="btn btn-secondary" onClick={() => this.onCreateCard()}>Nuova scheda</button>
            </div>
            <h3>{this.props.column.title}</h3>
            {this.props.cards && this.props.cards.map((c) => <Card key={c.index} card={c} loadCards={this.loadCards}
            moveUp={this.moveUp} moveDown={this.moveDown} moveLeft={this.moveLeft} moveRight={this.moveRight} 
            archiveCard={this.archiveCard} extractCard={this.extractCard} setEditCard={this.props.setEditCard}/>)}
            {(this.props.archiveCards && this.props.archiveCards.length > 0) && <h4>Schede archiviate</h4>}
            {this.props.archivedCards && this.props.archivedCards.map((c) => <Card key={c.index} card={c} loadCards={this.loadCards}
            moveUp={this.moveUp} moveDown={this.moveDown} moveLeft={this.moveLeft} moveRight={this.moveRight} 
            archiveCard={this.archiveCard} extractCard={this.extractCard} setEditCard={this.props.setEditCard}/>)}
        </div>
    }
}

class Card extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { links : [] };
    }

    componentDidMount() {
        //this.loadLinks();
    }

    onDelete = () => {
        API.deleteCard(this.props.card.cardId)
        .then(() => this.props.loadCards())
        .catch((errorObj) => this.handleErrors(errorObj));
    }

    onMoveUp = () => { 
        this.props.moveUp(this.props.card);
    }
    onMoveLeft = () => { 
        this.props.moveLeft(this.props.card);
    }
    onMoveRight = () => { 
        this.props.moveRight(this.props.card);
    }
    onMoveDown = () => { 
        this.props.moveDown(this.props.card);
    }

    onArchive = () => { 
        this.props.archiveCard(this.props.card);
    }
    onExtract = () => { 
        this.props.extractCard(this.props.card);
        this.props.loadCards(); 
    }

    loadLinks = () => {
        API.getLinks(this.props.card)
        .then((links) => this.setState({links : links}))
        .catch((errorObj) => this.handleErrors(errorObj));
    }

    onEdit = () => {
        const card = Object.assign({}, this.props.card);
        this.props.setEditCard(card, this.state.links);
    }

    handleErrors = (errorObj) => {

    }

    render() {
        
        return <div>
            <div className="card">
                <div className="card-header">
                    {(this.props.card.position < 0) && <button className="btn btn-primary"  onClick={() => this.onExtract()}>Estrai</button>}
                    {(this.props.card.position >= 0) && <>
                        <div class="float-right btn-group">
                            <button class="btn btn-secondary" onClick={this.onMoveUp}>↑</button>
                            <button class="btn btn-secondary" onClick={this.onMoveDown}>↓</button>
                            <button class="btn btn-secondary" onClick={this.onMoveLeft}>←</button>
                            <button class="btn btn-secondary" onClick={this.onMoveRight}>→</button> 
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-primary" data-toggle="modal" data-target="#editCardModal" onClick={() => this.onEdit()}>Modifica</button>
                            <button className="btn btn-secondary" onClick={() => this.onDelete()}>Elimina</button>
                            <button className="btn btn-secondary" onClick={() => this.onArchive()}>Archivia</button>
                        </div>
                    </>}
                </div>
                <div className="card-body">
                    <h4 className="card-title">{this.props.card.title}</h4>
                    <p className="card-text">{this.props.card.description}</p>
                    {this.state.links.map(l => <a href={l} className="card-link">{l}</a>)}
                </div>
            </div>
        </div>
    }
}

export default Board;