import React from 'react';
import io from 'socket.io-client'
import axios from 'axios';
export default class AddConversation extends React.Component{
    constructor(props) {
        super(props);
        require("../styles/AddConversation.scss");
        this.onWebSocketMessage = this.onWebSocketMessage.bind(this);
        this.onDataListChange = this.onDataListChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.onConversationSubmit = this.onConversationSubmit.bind(this);
        this.state={};
    }

    userList(userArray){
        return userArray ? userArray.map(user =>{
            return <option data-id={user._id} value={user.username}/>;
        }) : null;
    }

    onWebSocketMessage(data){
        this.setState({userArray: JSON.parse(data)});
    }

    componentDidMount(){
        this.userSocket = io(`${window.location.protocol == 'http' ? 'http' : 'https'}://${window.location.hostname}/userstream`);
        this.userSocket.on('connect',function(event){
            this.userSocket.on('message', this.onWebSocketMessage)
        }.bind(this));
    }

    onDataListChange(e){
        if (e.target.value.length > 0 && this.userSocket.connected){
            this.userSocket.emit('message',e.target.value);
        }
    }

    onConversationSubmit(){
        let userName = document.getElementById("userSearchBox").value;
        this.state.userArray.forEach(element => {
            if (userName == element.username){
                axios.post('/conversations',{
                    users: [this.props._id,element._id],
                    userid : this.props._id,
                    content: document.getElementById("newConvText").value
                });
            }
        });
    }

    render(){
        return <div className={"addConversation"}>
            <label htmlFor="userSearchBox">Send To:</label>
        <input id="userSearchBox" type={"text"} list={"userDataList"} 
        className={"userSearchBox"} onChange={this.onDataListChange}/>
        <datalist id={"userDataList"} className={"userDataList"}>
            {this.userList(this.state.userArray)}
        </datalist>
        <label htmlFor="newConvText">Message:</label>
        <input id={"newConvText"} type={"text"} />
        <input type={"submit"} title={"Create Conversation"} className={"submitButton"} onClick={this.onConversationSubmit}/>
        </div>
    }
}