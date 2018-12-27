import React, { Component, PureComponent } from 'react';
import ChatMessages from './ChatMessagesContainer';
import ConversationContainer from './ConversationContainer';
import '../styles/sheets/ChatMessages.scss';

import io from 'socket.io-client';


// Conversation Page Component
export default class Conversations extends PureComponent{
    constructor(props){
        super(props);
        this.onWebSocketMessage = this.onWebSocketMessage.bind(this);
    }
    componentDidMount(){
        // Open ws connection
        this.props.dispatchers.dispatchGetConversations();
        this.messageSocket = io(`${window.location.protocol == 'http' ? 'http' : 'https'}://${window.location.hostname}/messagestream`);
        this.messageSocket.on('connect', function (event) {
            this.messageSocket.emit('message',localStorage.getItem("userId"));
            this.messageSocket.on('message',this.onWebSocketMessage);
            console.log("Connection Open");
        }.bind(this));
    }
    
    // Close ws connection on destruction
    componentWillUnmount(){
        this.messageSocket.emit('disconnect',localStorage.getItem("userId"));
        return true;
    }
    // Handle new conversation data from ws
    async onWebSocketMessage(data){
        const conversation = JSON.parse(data);
        this.props.dispatchers.dispatchHandleMessage(conversation);
    }

    render(){
        return  <div className='row mx-auto'>
            <ConversationContainer state={this.props.state.conversations} dispatchers={
                {dispatchSelectConversation : this.props.dispatchers.dispatchSelectConversation}
            } />
            <ChatMessages state={this.props.state.messages} sendMessage = {this.props.dispatchers.dispatchSendChatMessage} />
            </div>
    }
}
