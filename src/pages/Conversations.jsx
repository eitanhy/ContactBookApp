import React, { Component, PureComponent } from 'react';
import ChatMessages from './ChatMessagesContainer';
import ConversationContainer from './ConversationContainer';
import '../styles/sheets/ChatMessages.scss';
import {connect} from 'react-redux';




export default class Conversations extends PureComponent{
    componentDidMount(){
        this.props.dispatchers.dispatchGetConversations();
    }
    render(){
        return  <div className='row mx-auto'>
            <ConversationContainer state={this.props.state.conversations} dispatchers={
                {dispatchSelectConversation : this.props.dispatchers.dispatchSelectConversation}
            } />
            <ChatMessages state={this.props.state.messages} />
            </div>
    }
}
