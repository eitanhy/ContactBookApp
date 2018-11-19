import React from 'react';
import io from 'socket.io-client'
export default class AddConversation extends React.Component{
    constructor(props) {
        super(props);
        require("../styles/AddConversation.scss");
        this.onWebSocketMessage = this.onWebSocketMessage.bind(this);
        this.onDataListChange = this.onDataListChange.bind(this);
        this.onDataListSelect = this.onDataListSelect.bind(this);
        this.state={};
    }

    userList(userArray){
        return userArray ? userArray.map(user =>{
            return <option data-id={user._id} value={user.username}/>;
        }) : null;
    }

    onWebSocketMessage(data){
        console.log(data);
        this.setState({userArray: JSON.parse(data)});
    }

    onDataListSelect(){
        this.userSocket = io(`${window.location.protocol == 'http' ? 'http' : 'https'}://${window.location.hostname}/userstream`);
        this.userSocket.on('connect',function(event){
            this.on('message', this.onWebSocketMessage)
        });
    }

    onDataListChange(e){
        if (e.target.value > 0 && this.userSocket.connected){
            this.userSocket.emit('message',e.target.value);
        }
    }
    onDataListLeave(){
        if (this.userSocket.connected){
            this.userSocket.emit('disconnect');
        }
    }
    render(){
        return <div>
            <label htmlFor="userSearchBox">Send To:</label>
        <input id="userSearchBox" type={"text"} list={"userDataList"} onFocus={this.onDataListSelect} className={"userSearchBox"} onChange={this.onDataListChange}/>
        <datalist id={"userDataList"} className={"userDataList"}>
            {this.userList(this.state.userArray)}
        </datalist>
        </div>
    }
}