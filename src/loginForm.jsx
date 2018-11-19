'use strict';

import loginTheme from "./material/loginTheme";
import ReactDOM from "react-dom";
import React from 'react';
import axios from 'axios';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SignUp from './signup.jsx';
import Fade from '@material-ui/core/Fade';
import { MuiThemeProvider,createMuiTheme } from '@material-ui/core/styles';
import Context from './appContext'
import {insertUserState} from './redux/actions/userActions'
import Root from './root'

export default class LoginForm extends React.Component{
    constructor(props){
        super(props);

        // Set submit to disabeld
        this.state = {submitDisabled : true,errorClass: 'authErrorHidden'};
        // Get redux store
        this.store = props.store;

        // Show or hide post sign up message
        (props.postSignup) ? this.state.postSignup = 'block' : this.state.postSignup = 'none';

        this.onInputText = this.onInputText.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(){
        let username = document.getElementById("username").value;
        let password = document.getElementById("pass").value;
        axios.post('/login', {
            username: username,
            password: password},{withCredentials: true}).then(function (response){
                axios.get('/users/'+response.data).then(function (userResponse) {
                    console.log(this);
                    this.store.dispatch(insertUserState(userResponse.data));
                    ReactDOM.render(<Root store={this.store} state={{isLoggedIn:true}} />,document.getElementById("root"));
                }.bind(this)).catch((error)=>{
                    console.log(error);
            });
        }.bind(this)).catch(function(error){
            if (error.response.status == 401){
                this.setState({errorClass: 'authErrorVisible'});
            }
        }.bind(this));
    }
    onInputText(){
        let username = document.getElementById("username").value;
        let password = document.getElementById("pass").value;
        if (username && password && this.state.submitDisabled) {
            this.setState({submitDisabled: false});
        }
        else if((!username || !password) && !this.state.submitDisabled){
            this.setState({submitDisabled: true});
        }
    }

    onSignUpClick(){
        ReactDOM.render(<Context.Consumer>
            {(context) => <MuiThemeProvider theme={loginTheme}><SignUp store={context.store}/></MuiThemeProvider>}
        </Context.Consumer>,document.getElementById("authForm"));
    }

    render(){
        return <Fade in={true} timeout={750}>
            <FormControl className={'loginForm'} margin={"normal"}>
                <FormLabel className={'formLabel'}>
                    Login
                </FormLabel>
                <div className={"postSignupLogin"} style={ {display : this.state.postSignup}}>Please enter your new Username & Password</div>
                <div id={"authError"} className={this.state.errorClass}>Incorrect username password</div>
                <TextField id={"username"} label={'User Name'} onChange={this.onInputText}/>
                <TextField id={"pass"} label={'Password'} type={'password'} onChange={this.onInputText}/>
                <Button className={'submitButton'} variant={"raised"} color={"primary"}
                            onClick={this.onSubmit} disabled={this.state.submitDisabled}>Sign In</Button>
                <Button  className={'submitButton'} variant={"flat"} color={"primary"} onClick={this.onSignUpClick}>Sign Up</Button>
            </FormControl>
        </Fade>;
    }
}