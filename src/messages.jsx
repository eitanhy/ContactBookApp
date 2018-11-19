import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';

export default class Messages extends React.Component{
    constructor(props){
        super(props);
        this.userId =this.props.userId;
        this.userName = this.props.userName;
        this.otherUser = this.props.otherUser;
        this.conversationID = this.props.conversationID;
        this.state ={messages: []};
        this.onWebSocketMessage = this.onWebSocketMessage.bind(this);
        this.onSend = this.onSend.bind(this);
    }
    componentDidMount(){
        axios.get(`/messages/${this.conversationID}`).then((result) => {
            console.log(result);
            this.setState({messages: result.data});
            this.scrollToBottom();
        }).catch(error => console.log(error));

        this.messageSocket = io(`${window.location.protocol == 'http' ? 'http' : 'https'}://${window.location.hostname}/messagestream`);
        this.messageSocket.on('connect', function (event) {
            this.messageSocket.emit('message',this.conversationID);
            this.messageSocket.on('message',this.onWebSocketMessage);
            console.log("Connection Open");
        }.bind(this));
    }

    async scrollToBottom(){
        let messageBox = document.getElementById("messageItems");
        messageBox.scrollTop = messageBox.scrollHeight;
    }

    onWebSocketMessage(data){
        let messages = this.state.messages;
        console.log(data);
        messages[messages.length] = JSON.parse(data);
        this.setState({messages: messages});
        this.scrollToBottom();
        console.log(this.props);
    }


    messageItems(messages) {
        if (messages) {
            let result = messages.map(message => {
                let sender="You";
                let className = "userMessage";
                if (message.sender && message.sender.toString() != this.userId.toString()) {
                    sender=this.otherUser;
                    className = "otherUserMessage";
                }
                return <div className={className}>
                    <span className={"messageInfo"}>
                        {sender + " " + message.date}
                    </span>
                    {message.content}
                </div>
            });
            return result;
        }
    }

    onSend(){
        let messageText = document.getElementById("messageText").value;
        if (messageText && messageText.length >0){
            axios.post(`/messages/${this.conversationID}`,{
                userID: this.userId,
                content: messageText
            });
        }

    }
    render(){
        console.log(this.state.messages);
        return <div className={"messageBox"}>
            <div className={"messageItems"} id={"messageItems"}>
            {this.messageItems(this.state.messages)}
            </div>
            <div className={"actionArea"}>
            <input className={"text"} type={"text"} id={"messageText"}/>
                <input className={"submit"} type={"button"} value={"Send"} onClick={this.onSend}
                />
            </div>
        </div>

    }
}

