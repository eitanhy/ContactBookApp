import {createStore,combineReducers, applyMiddleware} from 'redux';
import update from 'react-addons-update';
import thunk from 'redux-thunk';
import {GET_CONVERSATIONS,SELECT_CONVERSATION,INSERT_USER_STATE,USER_LOGIN, USER_LOGOUT, ADD_MESSAGE, ADD_CONVERSATION, ADD_ACTIVE_MESSAGE} from '../actions/actionTypes';


// Reducer for user actions
export const UserReducer = function (state, action) {
    let newState;
    switch (action.type) {
        case INSERT_USER_STATE:
            newState = {
                user : {
                    $set : action.data
                }
            }
            ;
            break;        
        default:{
            newState = {};
            break;
        }
    }
    if (!state){
        state={};
    }
    return update(state,newState);
};

// Reducer for login actions
export const LoginReducer = function (state, action) {
    let newState;
    switch (action.type) {
        case USER_LOGIN :
            newState = {
                login : {$set :{
                  isAuthenticated : true  
                }}
            };
            break;
        case USER_LOGOUT :
        newState = {
            login : {$set :{
                isAuthenticated : false  
            }}
        };
        break;
        
        default:{
            newState = {};
            break;
        }
    }
    if (!state){
        state={};
    }
    return update(state,newState);
};

// Reducer for Conversation actions
export const ConversationReducer = function (state, action) {
    let newState;
    switch (action.type) {
        case SELECT_CONVERSATION :
            let convIndex;
            for (let i=0 ; i < state.conversations.items.length;i++){
                if (state.conversations.items[i].id == action.id){
                    convIndex = i;
                    break;
                }
            }
            newState = { $merge : {
                messages : {
                    items : action.data,
                    username : action.username
                },
                conversations : {
                    selected : action.id,
                    items : state.conversations.items
                }
            } };

            newState.$merge.conversations.items[convIndex].messages = action.data;
            
            break;
        case ADD_CONVERSATION : {
            
            newState = {$merge :{
                conversations : {
                    items : [action.data, ...state.conversations.items]
                }
            }}
            break;
        }
        case ADD_MESSAGE : {
            if (state.conversations.items[action.index].messages){
                newState = {conversations : {
                                items: {
                                    [action.index] : {
                                        messages : {$set : [...state.conversations.items[action.index].messages,
                                            { content: action.data.latest,
                                                sender: action.data.userid,
                                                date : action.data.date
                                            }
                                        ]}
                                    }
                                }
                            }
                        }
            }
            newState = {}
            break;
        }
        case ADD_ACTIVE_MESSAGE : {
            newState = {$merge :{
                messages : {
                    items : [{ content: action.data.latest,
                        sender: action.data.userid,
                        date : action.data.date
                    }, ...state.messages.items]
                }
            }}
            break;
        }
        case GET_CONVERSATIONS :
            newState ={$merge : {
                conversations : { 
                    items : action.data
                }
            }};
            break;
        default:{
            newState = {};
            break;
        }
    }
    if (!state){
        state={};
    }
    return update(state,newState);
};





// Handles new actions & updates the state accordingly
// Create store with multiple reducers
export const appStore = createStore(combineReducers({userStateReducer: UserReducer, loginStateReducer: LoginReducer ,
                        conversationStateReducer: ConversationReducer}),{conversationStateReducer : {conversations: {},messages: []}}
                        , applyMiddleware(thunk));



