import React,{PureComponent} from 'react';
import TextBox from '../UIComponents/TextBox';


const ChatMessage = React.memo(props => {
    return  <div>
    <span>{props.message.sender == props.userId ? 'You' : props.with} : </span>
        {props.message.content}
    </div>
})

// Component which hold the selected chat messages
export default class ChatMessages extends PureComponent{
    render(){
        let userId = localStorage.getItem('userId');
        return <div className='mt-2 ChatContainer'>
            <div className='card ChatCard'>
                <div className='bg-dark'>
                    <span className="h1 text-light CardHeader">Conversation with {this.props.state.username}</span>
                </div>
                <div className='ChatBody'>
                    { this.props.state && this.props.state.items ?
                        this.props.state.items.map(message => <ChatMessage message={message} userId={userId} with={this.props.state.username} />) : null
                    }
                </div>
                <TextBox onClick={this.props.sendMessage}/>
            </div>
        </div>
    }
}