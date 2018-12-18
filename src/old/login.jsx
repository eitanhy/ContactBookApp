'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import ButtonBase from '@material-ui/core/ButtonBase';
import AccountBox from '@material-ui/icons/AccountBoxOutlined';
import Card from '@material-ui/core/Card'
import LoginForm from './loginForm.jsx';
import styles from '../styles/_login.scss'
import Context from './appContext'

// represents the Home Card component holding login & sign up forms

export default class Login extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
            return <Card className={'loginCard'} elevation={12}>
                <div className={'loginLogoHeader'} color={"primary"}>
                    <AccountBox className={'loginLogo'}></AccountBox>
                    <span className={'loginLogoText'}>CBook</span>
                </div>
                <div id={"authForm"}>
                <Context.Consumer>{context => <LoginForm store={context.store}></LoginForm>}</Context.Consumer>
                </div>
            </Card>;
        }
}

