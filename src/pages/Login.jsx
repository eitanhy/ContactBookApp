import React from 'react';
import BasicForm from '../UIComponents/BasicSettingForm'
import {Redirect} from 'react-router';
import '../styles/sheets/Login.scss';
import {userLoginActionHandler} from '../redux/actions/userActions'

const Authenticate = function (dispatch){
    dispatch(document.getElementById('username').value,document.getElementById('password').value);
};

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