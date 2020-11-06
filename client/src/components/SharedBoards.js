import React from 'react';
import API from '../api/API';

class SharedBoards extends React.Component {
    constructor(props){
        super(props);
        this.state = {myBoards : [], otherBoards : []};
    }

    componentDidMount(){
        API.getMySharedBoards().then((boards) => {
            this.setState({myBoards : boards});
        }).catch((errorObj)=>{this.handleErrors(errorObj)});
        API.getOtherSharedBoards().then((boards) => {
            this.setState({otherBoards : boards});
        }).catch((errorObj)=>{this.handleErrors(errorObj)});
    }

    handleErrors = (err) => { }

    render(){
        return <div>
            <h4>Board condivise con altri</h4>
            <ul>
                {this.state.myBoards.map(b => <li><link to={"boards/"+b.boardId}>{b.name}</link></li>)}
            </ul>
            <h4>Board condivise con me</h4>
            <ul>
                {this.state.otherBoards.map(b => <li><link to={"boards/"+b.boardId}>{b.name}</link></li>)}
            </ul>
        </div>
    }
}

export default SharedBoards;