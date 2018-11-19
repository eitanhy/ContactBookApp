import {createStore,combineReducers} from 'redux';
import update from 'react-addons-update';

import {FIELD_INVALID,FIELD_OK,CLEAR_SIGNUP,INSERT_USER_STATE} from '../actions/actionTypes'

const initialState = {
    signup: {
        username: {className: 'signupInvalidHidden'},
        confirmPassword: {className: 'signupInvalidHidden'},
        password: {className: 'signupInvalidHidden'},
        email: {className: 'signupInvalidHidden'},
        firstname: {className: 'signupInvalidHidden'},
        lastname: {className: 'signupInvalidHidden'},
        telephone: {className: 'signupInvalidHidden'},
        submit: {className: 'signupInvalidHidden'}
    }
};

// Reducer for user actions
export const reducer = function (state, action) {
    let newState;
    switch (action.type) {
        case INSERT_USER_STATE:
            newState = {
                user : {
                    $set : action.user
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
        return initialState;
    }
    return update(state,newState);
};

// Handles new actions & updates the state accordingly
export const singupReducer = function (state, action) {
        let newState;
        if (!state){
            return initialState;
        }
        switch (action.type) {
            case FIELD_OK:
                newState = {
                        signup : {
                                latestUpdate : {$set: action.fieldName},
                                [action.fieldName] : {
                                    className : {$set: 'signupInvalidHidden'}
                                }
                        }

                };

                break;
            case CLEAR_SIGNUP:{
                return initialState;
                break;
            }
            case FIELD_INVALID:
                newState = {
                        signup : {
                            latestUpdate : {$set: action.fieldName},
                            [action.fieldName] : {
                                className : {$set :'signupInvalidVisible'},
                                text : {$set : action.text}
                            }

                        }

                };
                break;

            default:{
                newState = {};
            }
        }

        return update(state,newState);
    };

// Create store with multiple reducers
export const appStore = createStore(combineReducers({userStateReducer: reducer,signupReducer: singupReducer}), initialState);



