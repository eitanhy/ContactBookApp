
import {connect} from "react-redux";
import React from 'react';
import {mapStateToProps} from "../redux/actions/signupActions";


// represents an error message on a field in the signup form
// Class is provided by redux store state
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
    // Connect to state mapper
    export default connect(mapStateToProps)(InvalidFieldComponent);