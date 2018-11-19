'use strict';

var express = require('express'),
    app = express(),
    https = require('https'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cookies = require('cookies'),
    cookieParser = require('cookie-parser'),
    port = 3000;

// initiliaze export for child scripts
var exports = module.exports = {};


// Load module for file operations
const fs = require('fs');
// Load app constants configured in package.json
const consts =  JSON.parse(fs.readFileSync('package.json', 'utf8'));

// configure params for HTTPS
const ssloptions = {
    key: fs.readFileSync('config/keystore/key.pem'),
    cert: fs.readFileSync('config/keystore/localhost.pem')
};

// load modules for bulding the API, parsing data and for HTTP client,
// Initiliazion of web service
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'secret'}));
var server = https.createServer(ssloptions,app);
var io = require('socket.io').listen(server);

server.listen(443);
console.log('todo list RESTful API server started on: ' + port);


// Add the app and the constants to exports, to be accessed
module.exports  = {express,app,consts,server,io};

// Make basic DB functions available for the controllers
var dbFuncs = require("./controllers/dbFuncs");
module.exports.dbFuncs = dbFuncs;

// Get token for DB operations & schedule it's refresh
dbFuncs.getToken();
setInterval(dbFuncs.getToken, 500000);

// import the User service controller
require("./controllers/usersController");
require("./controllers/conversations");
require("./controllers/messages");

app.get("/",(req,res) => res.sendFile('dist/index.html', { root: __dirname }));


app.get('/dist/:fileName', async function(req,res) {
    fs.readFile(`dist/${req.params.fileName}`,function (error,data) {
        if (!error){
            res.setHeader('Content-Type','text/javascript');
            res.end(data);
        }
    })
});

app.get('/dist/styles/:fileName', async function(req,res) {
    fs.readFile(`dist/styles/${req.params.fileName}`,function (error,data) {
        if (!error){
            if (req.params.fileName.endsWith('.svg')) {
                res.setHeader('Content-Type','image/svg+xml');
            }
            else {
                res.setHeader('Content-Type', 'text/css');
            }
            res.end(data);
        }
    })
});

app.get('/dist/styles/fonts/:fileName', async function(req,res) {
    fs.readFile(`dist/styles/${req.params.fileName}`,function (error,data) {
        if (!error){
            res.end(data);
        }
    })
});

