import React from 'react';
import {Link} from "react-router-dom";
import {AuthContext} from '../auth/AuthContext'

const Header = (props) => {
    return <AuthContext.Consumer>
        {(context) => (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item"><Link to="/home" className="nav-link">Home</Link></li>
                    <li className="nav-item"><Link to="/exams" className="nav-link">Esami</Link></li>
                </ul>
                <ul className="nav navbar-nav navbar-right">
                    <li className="nav-item">{context.student && <p>Studente mat. {context.student}</p> }</li>
                    {context.teacher && <>
                        <li className="nav-item "><p>Docente {context.teacher.username}</p></li>
                        <li className="nav-item "><Link to="/exams" onClick = {() => {context.logoutTeacher()}}>Esci</Link></li>
                    </>}
                    <li className="nav-item float-right">{!context.teacher && <Link to="/login" className="nav-link">Area docenti</Link>}</li>
                    </ul>
            </nav>
        )}
    </AuthContext.Consumer>
}

export default Header;