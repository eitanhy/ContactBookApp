import {SELECT_CONVERSATION,GET_CONVERSATIONS} from './actionTypes'
export function selectConversation(data,id){
    return {
        type: SELECT_CONVERSATION,
        data: data,
        id : id
    }
}

export function getConversations(data){
    return {
        type: GET_CONVERSATIONS,
        data: data
    }
}

export function selectConversationHandler(id){
    return async function(dispatch,getState){
        fetch(`/api/messages/${id}`,{
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then(response => {
            if (response.ok){
               response.json().then(data => dispatch(selectConversation(data,id)));
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
                   if (!getState().conversationStateReducer.conversations.selected) {dispatch(selectConversationHandler(data[0]._id))}
               });
            }
            else{
            }
        })
    }
};