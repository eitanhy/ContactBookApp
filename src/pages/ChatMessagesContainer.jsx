import React,{PureComponent} from 'react';
import {connect} from 'react-redux';
import TextBox from '../UIComponents/TextBox';


const ChatMessage = React.memo(props => {
    return  <div>
    <span>{props.message.sender == props.userId ? 'You' : 'Moses'} : </span>
        {props.message.content}
    </div>
})


export default class ChatMessages extends PureComponent{
    render(){
        let userId = localStorage.getItem('userId');
        return <div className='mt-2 ChatContainer'>
            <div className='card ChatCard'>
                <div className='bg-dark'>
                    <span className="h1 text-light CardHeader">Conversation with Dudu Faruk</span>
                </div>
                <div className='ChatBody'>
                    { this.props.state ?
                        this.props.state.map(message => <ChatMessage message={message} userId={userId} />) : null
                    }
                </div>
                <TextBox />
            </div>
        </div>
    }
}