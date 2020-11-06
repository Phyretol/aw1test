import React from 'react';
import {Link} from "react-router-dom";
import {AuthContext} from '../auth/AuthContext'

const Header = (props) => {
    return <AuthContext.Consumer>
        {(context) => (
            <nav className="navbar">
                <Link to="/home" className="nav-link">Home</Link>
                <Link to="/shared" className="nav-link">Board condivise</Link>
                {!context.authUser && <Link to="/login" className="nav-link">Login</Link>}
                {context.authUser && <>
                    <Link onClick = {() => {context.logoutUser()}}>Logout</Link>
                    <p class="navbar-brand">Benvenuto, {context.authUser.name}!</p> 
                </>}
            </nav>
        )}
    </AuthContext.Consumer>
}

export default Header;