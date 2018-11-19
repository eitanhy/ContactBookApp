import {CLEAR_SIGNUP,FIELD_OK,FIELD_INVALID} from './actionTypes'


// Process the state which was handled by signup reducer
export const mapStateToProps = state => {
    if (state.signupReducer != undefined) {
        return Object.assign({}, {state: state.signupReducer.signup});
    }
    return Object.assign({},{state: state})
};

export function fieldValid(fieldName) {
    return {
        type: FIELD_OK,
        fieldName: fieldName,
    }
}

export function fieldInvalid(fieldName, text) {
    return {
        type: FIELD_INVALID,
        fieldName: fieldName,
        text
    }
}

export function clearSignup() {
    return {
        type: CLEAR_SIGNUP,

    }
}