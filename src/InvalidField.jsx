// Maps state returned from the reducer to the state the component accepts
import {connect} from "react-redux";
import React from 'react';
import {mapStateToProps} from "./redux/actions/signupActions";

// Provides dispatches of actions to the component

export class InvalidFieldComponent extends React.Component{
    constructor(props){
        super(props);
        this.fieldName = props.fieldName;
        console.log(this.props);
    }
    render(){
        // Props state is recieved with redux
        return <div className={this.props.state[this.fieldName].className}>{this.props.state[this.fieldName].text}</div>;
    }
}

    export default connect(mapStateToProps)(InvalidFieldComponent);