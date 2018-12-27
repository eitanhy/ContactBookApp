import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/sheets/Menu.scss';

// Adjustable menu options
const MenuOptions = function(props){

    return <div className="collapse navbar-collapse">        
                <ul className="navbar-nav">
        {props.options.map((option) =>{
            return <li className="nav-item pr-2">
            <Link to={option.path} >{option.text}</Link>
        </li>
        })}
    </ul>
        </div>
    
}

// Menu Nav Bar
const Menu = function (props){
    return <nav className="navbar navbar-dark bg-dark navbar-expand-lg navbar-expand-sm">
        <div className="navbar-brand">
            <img src='styles/phoneBook.svg'/>
        </div>
        <MenuOptions options={[{
            text: "Activity Overview",
            path: '/'
        },{
            text: "Conversations",
            path: '/conversations'
        },{
            text: "Settings",
            path: '/settings'
        }]} />
        <button type="button" className="btn btn-light" onClick={props.logoutDispatcher}>
            Logout
        </button>
    </nav>;
}

export default React.memo(Menu);