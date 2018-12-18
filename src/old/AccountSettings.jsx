import React from 'react';
import styles from '../styles/accountsettings.scss'
import {insertUserState, mapStateToProps} from "../redux/actions/userActions";
import {connect} from 'react-redux';
import axios from 'axios';
export default class AccountSettings extends React.Component{
    constructor(props){
        super(props);
        this.onApply = this.onApply.bind(this);
        this.onColorSelect = this.onColorSelect.bind(this);

        // state for color update on setting screen
        this.state = {skinColor : this.props.state.settings.primaryColor,
        userColor : this.props.state.settings.primaryColor};
    }

    // Update user with API Call + Redux Store dispacth for current session
    onApply(){
        
        let requestBody ={
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            settings: {
                primaryColor: document.getElementById("color").value
            }
        } ;
        if (document.getElementById("password").value){
            requestBody.password = document.getElementById("password").value;
        }
        axios.put(`/users/${this.props.state._id}`,requestBody).then(function(){
            axios.get(`/users/${this.props.state._id}`).then(function(res){
            this.props.dispatch(insertUserState(res.data))}.bind(this))
        }.bind(this));
        this.setState({userColor: requestBody.settings.primaryColor});
    }

    onColorSelect(e){
        console.log(e.target.value);
        this.setState({skinColor: e.target.value});
    }

    render(){
        return <div className={"settings"} style={{backgroundColor : this.state.userColor}}>
                    <div className={"settingsForm"}>
                        <div className={"formAttribute"}>
                            <div className={"attributeDesc"}>
                                Username
                            </div>
                            <div className={"attributeValue"}>
                                <input id={"username"}type={'text'} defaultValue={this.props.state.username} />
                            </div>
                        </div>
                        <div className={"formAttribute"}>
                            <div className={"attributeDesc"}>
                                Email
                            </div>
                            <div className={"attributeValue"}>
                                <input id={"email"}type={'text'} defaultValue={this.props.state.email}/>
                            </div>
                        </div>

                        <div className={"formAttribute"}>
                            <div className={"attributeDesc"}>
                                Password
                            </div>
                            <div className={"attributeValue"}>
                                <input id={"password"}type={'password'}/>
                            </div>
                        </div>

                        <div className={"formAttribute"}>
                            <div className={"attributeDesc"}>
                                Skin Color
                            </div>
                            <div className={"attributeValue"}>
                                <select id={"color"} style={{backgroundColor: this.state.skinColor}} onChange={(e) => this.onColorSelect(e)}>
                                    <option value={"#111111"} style={{backgroundColor: 'black'}}></option>
                                    <option value={"#FF4136"} style={{backgroundColor: 'red'}}></option>
                                    <option value={"#0074D9"} style={{backgroundColor: 'blue'}}></option>
                                    <option value={"#85144b"} style={{backgroundColor: 'purple'}}></option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={"applyButton"}>
                        <input type={'submit'} title={"Update Account"} value={"Update Account"} onClick={this.onApply}/>
                    </div>
            </div>
    }
}
