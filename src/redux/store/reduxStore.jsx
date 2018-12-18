import {createStore,combineReducers, applyMiddleware} from 'redux';
import update from 'react-addons-update';
import thunk from 'redux-thunk';

import {GET_CONVERSATIONS,SELECT_CONVERSATION,INSERT_USER_STATE,USER_LOGIN, USER_LOGOUT} from '../actions/actionTypes'

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

export const ConversationReducer = function (state, action) {
    let newState;
    switch (action.type) {
        case SELECT_CONVERSATION :
            newState = {
                messages : {
                    $set : action.data
                },
                conversations : {
                    selected : {$set : action.id}
                }
            };
            break;
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



