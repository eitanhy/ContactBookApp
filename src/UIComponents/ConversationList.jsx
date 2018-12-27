import React from 'react';

// Conversation Item
const ConversationItem = React.memo(props =>{
        return <div className={`mb-2 border rounded ${props.isSelected ? 'bg-primary' : 'bg-light'} ConversationItem`}
                onClick={() => props.selectConversation(props.conversation.id,props.conversation.username)}>
                <div className='ConversationDate'> 
                    Latest : {props.conversation.date} From : {props.conversation.userid == localStorage.getItem('userId') ? 'You' : props.conversation.username}
                </div>
                <div className='ConversationWith'>
                    Conversation With : {props.conversation.username}
                </div>
                <div className='LatestMessage'>
                    {props.conversation.latest}
                </div>
                </div>;
});

// Conversation List in Conversations Page
const ConversationList = React.memo(props => {
    
    return <div className='ConversationList'>
        {props.conversations ? props.conversations.map(conversation =>{
            return <ConversationItem conversation={conversation} selectConversation={props.selectConversation} isSelected={props.selected == conversation.id}/>
        }) : null}
    </div>
});

export default ConversationList;