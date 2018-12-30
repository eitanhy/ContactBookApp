import {USER_LOGOUT,USER_LOGIN,INSERT_USER_STATE} from './actionTypes'

// actions & middleware for user operations

function loginUser(){
    return{
        type: USER_LOGIN
    }
}

function insertUserState(data){
    return {
        type: INSERT_USER_STATE,
        data: data
    }
}

export function insertUserStateActionHandler(){
    return async function(dispatch,getState){
        fetch(`/api/users/${localStorage.getItem('userId')}`,{
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then(response => {
            if (response.ok){
               response.json().then(data => dispatch(insertUserState(data)));
            }
            else{
    
            }
        })
    }
}

export function logoutUserAction(){
    localStorage.removeItem('userId');
    return {
        type: USER_LOGOUT
    }
}

export function userLoginActionHandler(username,password){
    return async function(dispatch, getState){
        fetch('/api/login',{
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(response => {
            if (response.ok){
               response.json().then(data => {
                   localStorage.setItem('userId',data)
                   dispatch(insertUserStateActionHandler());
                   dispatch(loginUser());
                });
            }
            else{
    
            }
        })
    }
};


export function userSSOActionHandler(){
    return async function(dispatch, getState){
        fetch('/api/session',{
            credentials: 'include',
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                userId: localStorage.getItem('userId')
            })
        }).then(response => {
            if (response.ok){
                dispatch(insertUserStateActionHandler());
               dispatch(loginUser());
               
            }
            else{
    
            }
        })
    }
};



