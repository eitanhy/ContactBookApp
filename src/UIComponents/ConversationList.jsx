import React from 'react';


const ConversationItem = React.memo(props =>{
        return <div className={`mb-2 border rounded ${props.conversation._id==props.selected ? 'bg-primary' : 'bg-light'} ConversationItem`}
                onClick={() => props.selectConversation(props.conversation._id)}>
                <div className='ConversationDate'> 
                    Received : {props.conversation.date}
                </div>
                <div className='ConversationWith'>
                    Conversation With : {props.conversation.username}
                </div>
                <div className='LatestMessage'>
                    {props.conversation.latest}
                </div>
                </div>;
});

const ConversationList = React.memo(props => {
    console.log('Rendering');
    return <div className='ConversationList'>
        {props.conversations ? props.conversations.map(conversation =>{
            return <ConversationItem conversation={conversation} selectConversation={props.selectConversation} selected={props.selected}/>
        }) : null}
    </div>
});

export default ConversationList;