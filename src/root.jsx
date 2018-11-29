'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login.jsx';
import '../styles/root.scss';
import loginTheme from './material/loginTheme.jsx';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {appStore} from "./redux/store/reduxStore";
import styles from "../styles/root.scss";
import Context from './appContext';
import Home from './Home';
import axios from "axios/index";
import {insertUserState, mapStateToProps} from "./redux/actions/userActions";
import {connect} from 'react-redux';
import {INSERT_USER_STATE} from "./redux/actions/actionTypes";




export default class Root extends React.Component {
    constructor(props){
        super(props);
        // Check if root page is a redirect from login
        this.fakeSignIn.bind(this);
        //this.fakeSignIn();
    }


    fakeSignIn(){
        let result = axios.post('/login',{username:'eitan',password: 'eitan'}, {withCredentials: true}).then(function (response) {
            axios.get('/users/' + response.data).then(function (userResponse) {
                this.props.store.dispatch(insertUserState(userResponse.data));
            }.bind(this)).catch((error) => {
                console.log(error);
            });
        }.bind(this)).catch(function (error) {
        }.bind(this));
    }
    render(){
        console.log(this);
        // Present Signup & Login forms with material-ui theme
        if (!this.props.state) {
            return <MuiThemeProvider theme={loginTheme}>
                <Login/>
            </MuiThemeProvider>;
        }

        // Redirect to the GUI - with updated context with logged in user details
        else{
            return <Home store={this.props.store}/>;
        }
    }
}

const RootComponent = connect(mapStateToProps)(Root);

ReactDOM.render(<RootComponent store={appStore}/>,document.getElementById("root"));