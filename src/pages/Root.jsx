import React, { Component } from 'react';
import {BrowserRouter,withRouter} from "react-router-dom";
import {Switch,Route,Redirect} from 'react-router';
import App from './Home';
import Login from './Login';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {appStore} from "../redux/store/reduxStore";
import {userLoginActionHandler,logoutUserAction,userSSOActionHandler} from "../redux/actions/userActions";
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/sheets/Root.scss'


// Root component
class Root extends Component{
    constructor(props){
        super(props);
        require('jquery');
    }

    componentDidMount(){
        // Try to login with previous session
        if ((!this.props.state || !this.props.state.isAuthenticated) && this.props.location.pathname != '/login'
            && localStorage.getItem('userId')){
            this.props.dispatchUserSSO();
        }
        if (this.props.location.pathname != '/login'){
            this.requestedPath = this.props.location.pathname;
        }
    }
    
    render(){
        return <Switch>
            <Route path='/login' exact={true} render={function(){ 
                                                    return  this.props.state && this.props.state.isAuthenticated ? 
                                                <Redirect to={this.requestedPath ? this.requestedPath : '/home'} /> : 
                                                <Login dispatch={this.props.dispatchUserLogin}/>}.bind(this)} />
            <Route path='/' render={ function(){
                            return this.props.state && this.props.state.isAuthenticated ? 
                            <App logoutDispatcher={this.props.dispatchUserLogout} store={this.props.store}/> 
                            : <Redirect to='/login' /> }.bind(this)}/>
        </Switch>;
 }
}


const mapStateToProps = state => {
    // if the initialState is not undefined
    if (state.loginStateReducer != undefined) {
        return Object.assign({}, {state: state.loginStateReducer.login});
    }
    return Object.assign({},{state: state})
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchUserLogin: (username,password) => dispatch(userLoginActionHandler(username,password)),
        dispatchUserLogout: () => dispatch(logoutUserAction()),
        dispatchUserSSO : () => dispatch(userSSOActionHandler())
    };
};


const RootComponent = withRouter(connect(mapStateToProps,mapDispatchToProps)(Root));

ReactDOM.render(<BrowserRouter><RootComponent store={appStore}/></BrowserRouter>,document.getElementById("root"));



