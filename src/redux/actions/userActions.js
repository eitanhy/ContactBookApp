import {INSERT_USER_STATE} from './actionTypes'
import axios from "axios/index";
// Handles new actions & updates the state accordingly


// Process the state given by the userState reducer
export const mapStateToProps = state => {
    if (state.userStateReducer != undefined) {
        return Object.assign({}, {state: state.userStateReducer.user});
    }
    return Object.assign({},{state: state})
}

export function insertUserState(user) {
    return {
        type: INSERT_USER_STATE,
        user: user
    }
}


