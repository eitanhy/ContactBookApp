/*
Function for querying couchDB
*/
'use strict';
const user = module.parent.exports.consts.customParams.username;
const pass = module.parent.exports.consts.customParams.pass;

var axios = require('axios');

var AuthCookie = null;


//query the DB - useful for non key queries
async function queryDB(dbName,argMap,retArray,resultLimit){
    let queryBody = {};
    queryBody.selector = argMap;
    if (retArray){
        queryBody.fields = retArray;
    }

    if (resultLimit){
        queryBody.limit = resultLimit;
    }

    let post_options = {
        url : `http://${module.parent.exports.consts.customParams.dbHost}:${module.parent.exports.consts.customParams.dbPort}/${dbName}/_find`,
        method : "post",
        headers: {
            Cookie: AuthCookie
        },
        data : queryBody
    };

    return await axios(post_options).then(function(response) {
        return response.data}).catch(function (){ return null;
    });
};

// Used for user search
async function getDocStartsWith(dbName,attribute,value,retArray,resultLimit){
    let queryBody = {};
    queryBody[attribute] = {"$regex" : "^"+value};
    return await queryDB(dbName,queryBody,retArray,resultLimit);
}

// get a document by key
async function getDoc(dbName,docId){
    let post_options = {
        url : `http://${module.parent.exports.consts.customParams.dbHost}:${module.parent.exports.consts.customParams.dbPort}/${dbName}/${docId}`,
        method : "get",
        headers: {
            Cookie: AuthCookie
        }
    };
    return await axios(post_options).then(function(response) { return response.data}).catch(function (){
        return null;
    });
};

async function appendArrayAttribute(dbName,docId,key,value){
    await getDoc(dbName,docId).then(async function(result){
        if (!result[key]){
            result[key] = [];
        }
        result[key].push(value);
        let newValue = {};
        newValue[key] = result[key];
        await updateDoc(dbName,docId,newValue);
    });
}

// update a document
async function updateDoc(dbName, docId,updateAttrs){

    let newData = await getDoc(dbName,docId);

    Object.keys(updateAttrs).forEach(function(key){
        newData[key] = updateAttrs[key];
    });

    let post_options = {
        url : `http://${module.parent.exports.consts.customParams.dbHost}:${module.parent.exports.consts.customParams.dbPort}/${dbName}/${docId}`,
        method : "put",
        headers: {
            Cookie: AuthCookie
        },
        data : newData
    };

    return await axios(post_options).then(function(response) { return response.data}).catch(function (){
        return null;
    });
};

// create a document
async function createDoc(dbName, createAttrs){
    let post_options = {
        url : `http://${module.parent.exports.consts.customParams.dbHost}:${module.parent.exports.consts.customParams.dbPort}/${dbName}`,
        method : "post",
        headers: {
            Cookie: AuthCookie
        },
        data : createAttrs
    };

    return await axios(post_options).then(function(response) { return response.data.id}).catch(function (){
        return null;
    });
};


// Get the authentication token for db operations
async function getToken(){
    let post_options = {
        url : `http://${module.parent.exports.consts.customParams.dbHost}:${module.parent.exports.consts.customParams.dbPort}/_session`,
        method : "post",
        data : {
            name : user,
            password : pass
        }
    };
    await axios(post_options).then(function(response) { AuthCookie = response.headers["set-cookie"][0].split(";")[0]}).catch(function (){
        // log error
    });
}

// Delete a doc by key
async function deleteDoc(dbName,docId){

    let rev = await getDoc(dbName,docId);
    rev = rev._rev;
    let post_options = {
        url : `http://${module.parent.exports.consts.customParams.dbHost}:${module.parent.exports.consts.customParams.dbPort}/${dbName}/${docId}?rev=${rev}`,
        method : "delete",
        headers: {
            Cookie: AuthCookie
        }
    };

    return await axios(post_options).then(function(response) { return response.data}).catch(function (){
        return null;
    });
};


module.exports = {queryDB,updateDoc,getDoc,createDoc,deleteDoc,getToken,appendArrayAttribute,getDocStartsWith};
