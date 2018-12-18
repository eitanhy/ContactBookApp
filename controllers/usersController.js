'use strict';

// Api for user data & authorization
// TODO: seperate

// used for mapping new endpoints
var app = module.parent.exports.app,
    express = module.parent.exports.express,
    server = module.parent.exports.server,
    redis = require('redis'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    io = module.parent.exports.io,
    dbFuncs =  module.parent.exports.dbFuncs,
    dbNames = module.parent.exports.consts.customParams.dbNames;

var userSocketNs = io.of('userstream');


const uuidv4 = require('uuid/v4');
const redisExpirationInterval = module.parent.exports.consts.customParams.redis.expiration;

var redisClient = redis.createClient(module.parent.exports.consts.customParams.redis.port,
    module.parent.exports.consts.customParams.redis.host, {password: module.parent.exports.consts.customParams.redis.pass});

redisClient.on('connect', function() {
    console.log('Redis client connected');
});

// set Application to use passportjs session management
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    async function(username, password, done) {
        let query = {};
        console.log(username+password);
        query.username = username;
        query.password = password;
        let retAttrs = ['_id'];
        let result = await dbFuncs.queryDB(dbNames.users,query, retAttrs);
        if (result.docs.length > 0){
            return done(null,result.docs[0]._id);
        }
        else{
            return done(null,false,{ message:'Wrong Username&Password combintaion'});
        }
    }
));

// Generate token for authenticated user & save in redis
// Set the default authentication method
passport.serializeUser(function(user, done) {
    let uuid = uuidv4();
    redisClient.set(uuid,user,'EX',redisExpirationInterval);
    done(null, uuid);
});

// checks if the token exists in redis - if so returns the userid
passport.deserializeUser(async function(token,done){
    return redisClient.get(token,  function (err,result) {
        if (err){
            done(null,false);
        }
        done(null, result);
    });
});


// Succesful Login = returns user id
// Failure in Login = 401 HTTP ERROR
module.parent.exports.app.post('/api/login/',
    passport.authenticate('local'),
    function (req,res) {
    console.log("in!");
        res.end(req.user);
    }
);


module.parent.exports.app.post('/api/sso/',
    function (req,res) {
    console.log("in!");
        let uid = req.session.passport.user;
        let userId = req.body.userId;
        redisClient.get(uid, function (err,result){
            if (err || result != userId){
                res.status(401).end();
            }
            res.end();
        })
    }
);

/* To be used as a middleware funciton for authorizing users in the API*/
var customAuthorization = function(req,res,next){
    redisClient.get(req.session.passport.user,  function (err,result) {
        if (err || result != req.params.userid){
            res.status(401).send("Unauthorized");
        }
        else{
            next();
        }
    });
};


// Checks if specified username \ email exists in user database
module.parent.exports.app.get('/users/existence', async function(req,res) {
    let username = req.params.username;
    let email = req.params.email;
    let query = undefined;
    if (username != undefined){
        query = {username : username};
    }
    else if (email != undefined){
        query = {email : username};
    }
    let result = await dbFuncs.queryDB(dbNames.users,query, null);
    if (result.docs != undefined) {
        res.end(true);
    }
    res.end(false);
});

/*
app.ws('/friendstream', function (ws,res) {
    ws.on('message', function(data){
        //generate an ID for this socket
        // Save socket in map
        // Send initial data through socket

        })
    });
}); */

userSocketNs.on('connect',(socket)=> {
    socket.on('message', function (data) {
        dbFuncs.getDocStartsWith(dbNames.users, "username", data, ['username', '_id'],5).then(function (result) {
            socket.emit('message', JSON.stringify(result.docs));
        });
    })
});


// Update function - retrieves the existing document and modifies specific updated values
module.parent.exports.app.put('/users/:userid', customAuthorization,
    async function(req, res) {
    let result = await dbFuncs.updateDoc(dbNames.users,req.params.userid,req.body);
    res.send(result);
});


module.parent.exports.app.post('/users',async function(req, res) {
    let result = await dbFuncs.createDoc(dbNames.users,req.body)
    res.send(result);
});

// Return user state without the password
module.parent.exports.app.get('/api/users/:userid', async function(req,res) {
   let result = await dbFuncs.getDoc(dbNames.users,req.params.userid)
    delete result.password;
    res.send(result);
});


module.parent.exports.app.delete('/users/:userid', async function(req,res) {
    let result = await dbFuncs.deleteDoc(dbNames.users,req.params.userid)
    res.send(result);
});

