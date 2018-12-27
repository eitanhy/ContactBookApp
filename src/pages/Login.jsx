import React from 'react';
import BasicForm from '../UIComponents/BasicSettingForm'
import '../styles/sheets/Login.scss';



// Authenticate using redux middelware
const Authenticate = function (dispatch){
    dispatch(document.getElementById('username').value,document.getElementById('password').value);
};
// Represents the login page card
const LoginPage = (props) => {
    return  <div className="card w-50 mx-auto mt-2">
        <div className='bg-dark'>
            <img className="w-25"src='styles/phoneBook.svg'/>
            <span className="h1 text-light">Contact Book</span>
        </div>
        <div className='card-body'>
        <h2>Login</h2>
            <BasicForm fields={[
                {name:'username',description:'Username', type:'text'},
                {name:'password',description:'Password', type:'password'},
            ]} submitText='Login' onSubmit={ ()=> Authenticate(props.dispatch)}/>
        </div>
    </div>
};

export default LoginPage;