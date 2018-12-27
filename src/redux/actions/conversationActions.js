import {SELECT_CONVERSATION,GET_CONVERSATIONS,ADD_MESSAGE,ADD_CONVERSATION,ADD_ACTIVE_MESSAGE} from './actionTypes'

// Actions & middleware related to conversations

export function selectConversation(data,username,id){
    return {
        type: SELECT_CONVERSATION,
        data: data,
        username: username,
        id : id
    }
}

export function getConversations(data){
    return {
        type: GET_CONVERSATIONS,
        data: data
    }
}

export function selectConversationHandler(id,username){
    return async function(dispatch,getState){
        fetch(`/api/messages/${id}`,{
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then(response => {
            if (response.ok){
               response.json().then(data => dispatch(selectConversation(data,username,id)));
            }
            else{
    
            }
        })
    }
}

export function getConversationsHandler(){
    return async function(dispatch,getState){
        fetch(`/api/conversations/${localStorage.getItem('userId')}`,{
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then(response => {
            if (response.ok){
               response.json().then(data => {
                   dispatch(getConversations(data));
                   dispatch(selectConversationHandler(data[0].id,data[0].username))
                });
            }
            else{
            }
        })
    }
};

function AddMessage(conversation,index){
    return {
        type: ADD_MESSAGE,
        data: conversation,
        index: index
    }
}

function AddConversation(conversation){
    return {
        type: ADD_CONVERSATION,
        data: conversation
    }
}

function AddActiveMessage(conversation){
    return {
        type: ADD_ACTIVE_MESSAGE,
        data:conversation
    }
}

export function AddMessageHandler(conversation){
    return async function(dispatch,getState){
        getState().conversationStateReducer.conversations.items.forEach((storedConv,index) => {
            if (storedConv.id == conversation.id){
                dispatch(AddMessage(conversation,index));
                if (getState().conversationStateReducer.conversations.selected == conversation.id){
                    dispatch(AddActiveMessage(conversation));
                }
            }
            else{
                dispatch(AddConversation(conversation));
            }
        });
        dispatch({type: "NOTHING"});
    }
}

export function sendChatMessage(content){
    return async function(dispatch,getState){
        const sender =  getState().userStateReducer.user._id;
        fetch(`/api/messages/${getState().conversationStateReducer.conversations.selected}`,{
            method : 'POST',
            credentials: 'include',
            body : JSON.stringify({
                sender : sender,
                content: content
            }),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then(response => {
            console.log(response);
        });
        dispatch({type:"NOTHING"});
    }
}

export async function NewConversation(to,content){
    return async function(dispatch,getState){
        let sender =  getState.userStateReducer.user._id;
        fetch('/api/conversations',{
            method: 'POST',
            body : {
                users: [{id : sender},{id: to}],
                content: content
            },
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then(()=> dispatch({type: "NOTHING"}));
    }

}