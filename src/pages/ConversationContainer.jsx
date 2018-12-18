import React,{PureComponent} from 'react';
import {connect} from 'react-redux';
import {selectConversationHandler,getConversationsHandler} from '../redux/actions/conversationActions';
import ConversationList from '../UIComponents/ConversationList';
import AddButton from '../UIComponents/AddButton';


export default class ConversationContainer extends PureComponent{
    constructor(props){
        super(props);
    }
    render(){
        return <div className={`col-md-2 mt-2 ConversationContainer`} style={{
            overflow: 'hidden',
            padding: '0',
            height: '85vh'
        }}>
            <AddButton />
        <ConversationList conversations={this.props.state ? this.props.state.items : []} 
                selected={this.props.state ? this.props.state.selected : null} 
                selectConversation={this.props.dispatchers.dispatchSelectConversation}/>
            </div>;
    }
}