'use strict';
import loginTheme from './material/loginTheme.jsx';
import { MuiThemeProvider,createMuiTheme } from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Home from './root.jsx';
import LoginForm from "./loginForm";
import {fieldInvalid,fieldValid,clearSignup} from "./redux/actions/signupActions";
import InvalidField from './InvalidField';
import axios from "axios/index";
import Context from './appContext'

const ADD = 'ADD';
const DELETE='DELETE';
export default class SignUp extends React.Component {
    constructor(props){
        super(props);
        //
        this.state = {confirmPassDisabled : true,submitDisabled: true,
                blankFields:new Set(['username','password','confirmPassword','firstname','lastname','email'])
                    };

        this.store = props.store;

        // Hide InvalidField description
        this.handleRequiredFields = this.handleRequiredFields.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Redirect to login screen
    redirectToLogin(isPostSignup){
        this.store.dispatch(clearSignup());
        ReactDOM.render(<MuiThemeProvider theme={loginTheme}><LoginForm store={this.store} postSignup ={isPostSignup}/></MuiThemeProvider>,document.getElementById("authForm"));
    }
    async onUsernameChange(e){
        if (e.target.value.length > 5){
            this.store.dispatch(fieldValid('username'));
            return {command: DELETE,id: e.target.id};
        }
        else{
            this.store.dispatch(fieldInvalid('username',"User name must be longer then 5 characters"));
            return {command: ADD,id: e.target.id}

        }
    }

    async onPassChange(e){
        if (e.target.value.length <= 5){
            // Show Error

            this.store.dispatch(fieldInvalid('password',"Password must be longer then 5 characters"));

            // render Confirm pass box
            this.setState({confirmPassDisabled : true});
            // Add to required field set
            return {command: ADD,id: e.target.id};
        }
        else {
            // Hide any error
            this.store.dispatch(fieldValid('password'));

            // Enable pass confirmation
            this.setState({confirmPassDisabled : false});

            if (document.getElementById("confirmPassword").value.length > 0
                && document.getElementById("confirmPassword").value != e.target.value){
                this.store.dispatch(fieldInvalid('confirmPassword',"Passwords must match"));
                return {command: ADD,id: "confirmPassword"};
            }
            else if (document.getElementById("confirmPassword").value == e.target.value){
                this.store.dispatch(fieldValid('confirmPassword'));
                return {command: DELETE,id: "confirmPassword"};
            }

            // Remove from required fields
            return {command: DELETE,id: e.target.id};
        }
    }

    async onPassConfirmChange(e){

        if (e.target.value != document.getElementById('password').value){
            this.store.dispatch(fieldInvalid('confirmPassword',"Passwords must match"));
            return {command: ADD,id: e.target.id};
        }
        else{
            this.store.dispatch(fieldValid('confirmPassword'));
            return {command: DELETE,id: e.target.id};
        }
    }

    async onNameChange(e){

        if (e.target.value.length > 0){
            this.store.dispatch(fieldValid(e.target.id));
            return {command: DELETE,id: e.target.id};
        }
        else{
            this.store.dispatch(fieldInvalid(e.target.id,"Must supply name"));
            return {command: ADD,id: e.target.id};
        }
    }

    async onEmailChange(e){
        let regExp = new RegExp(/[^@]*@[\w\d.-]*\.[a-z]*$/);
        if (regExp.test(e.target.value)){
            this.store.dispatch(fieldValid(e.target.id));
            return {command: DELETE,id: e.target.id};
        }
        else{
            this.store.dispatch(fieldInvalid(e.target.id,"Bad Email Format"));
            return {command: ADD,id: e.target.id};
        }
    }
    async onPhoneChange(e){
        let regExp = new RegExp(/\+?\d+\-?\d+\-?\d{6,9}/);
        if (regExp.test(e.target.value)){
            this.store.dispatch(fieldValid(e.target.id));
            return {command: DELETE,id: e.target.id};
        }
        else if (e.target.value.length == 0){
            this.store.dispatch(fieldValid(e.target.id));
            return {command: DELETE,id: e.target.id};
        }
        else{
            this.store.dispatch(fieldInvalid(e.target.id,"Bad Phone Format"));
            return {command: ADD,id: e.target.id};
        }
    }


    handleRequiredFields(data){
        let command = data.command;
        let id = data.id
        let blankFields = this.state.blankFields;
        switch (command){
            case ADD:
                if (!blankFields.has(id)){
                    blankFields.add(id);
                }
                break;
            case DELETE:
                blankFields.delete(id);
                break;
        }
        this.setState({blankFields: blankFields});
    }

    async onSubmit(){
        let body = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            email: document.getElementById("email").value,
            telephone: document.getElementById("telephone").value
        };
        axios.post('/users', body,{withCredentials: true}).then(() => {this.redirectToLogin(true)}).catch(function(error){
            this.store.dispatch(fieldInvalid('submit',"Server Error"));
        });
    }
    render(){
      return <Fade in={true} timeout={750}>
        <FormControl className={'loginForm'} margin={"normal"}>
                <FormLabel className={'formLabel'}>
                    Sign Up
                </FormLabel>
                <TextField id={"username"} label={'User Name'}onBlur={(e) => this.onUsernameChange(e).then(this.handleRequiredFields)} required={true}/>
                <InvalidField store={this.store}fieldName={"username"}/>
                <TextField id={"password"} label={'Password'} type={'password'} required={true}
                           onChange={(e) => this.onPassChange(e).then(this.handleRequiredFields)}/>
                <InvalidField store={this.store} fieldName={"password"}/>
                <TextField id={"confirmPassword"} label={'Confirm Password'} type={'password'}
                           disabled={this.state.confirmPassDisabled}
                           onBlur={(e) => this.onPassConfirmChange(e).then(this.handleRequiredFields)}  required={true}/>
                <InvalidField store={this.store} fieldName={"confirmPassword"}/>
                <TextField id={"firstname"} label={'First Name'} onBlur={(e)=> this.onNameChange(e).then(this.handleRequiredFields)}  required={true}/>
                <InvalidField store={this.store} fieldName={"firstname"}/>
                <TextField id={"lastname"} label={'Last Name'}
                           onBlur={(e)=> this.onNameChange(e).then(this.handleRequiredFields)} required={true}/>
                <InvalidField store={this.store} fieldName={"lastname"}/>
                <TextField id={"email"} label={'Email'} onBlur={(e)=> this.onEmailChange(e).then(this.handleRequiredFields)}  required={true}/>
                <InvalidField store={this.store} fieldName={"email"}/>
                <TextField id={"telephone"} label={'Tel. Number'} onBlur={(e)=> this.onPhoneChange(e).then(this.handleRequiredFields)}/>
                <InvalidField store={this.store} fieldName={"telephone"} />
                <Button id={'submit'} className={'submitButton'} variant={"raised"} color={"primary"} onClick={this.onSubmit}
                        disabled={this.state.blankFields.size}>Sign Up!</Button>
                <InvalidField store={this.store} fieldName={"submit"} />
                <Button className={'submitButton'} variant={"flat"} color={"primary"} onClick={() => this.redirectToLogin(false)}>Cancel</Button>
        </FormControl>
      </Fade>;
    }
}
