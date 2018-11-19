const uuidv4 = require('uuid/v4');
var dbFuncs =  module.parent.exports.dbFuncs,
dbNames = module.parent.exports.consts.customParams.dbNames,
app = module.parent.exports.app,
io = module.parent.exports.io,
server = module.parent.exports.server;

var convSocketNs = io.of('convstream');




async function getConversationsForUser(userId){
    let conversations = [];
    await dbFuncs.getDoc(dbNames.users,userId).then(
        async function(userObject){
            // Go Through Conversations
            for (var convId in userObject.conversations) {
                // Get conversation data
                await dbFuncs.getDoc(dbNames.conversations, userObject.conversations[convId]).then(async function (convResult) {
                    // Get username of other user
                    for (let user in convResult.users) {
                        if (convResult.users[user] != userId) {
                            await dbFuncs.getDoc(dbNames.users, convResult.users[user]).then(function (convUserRes) {
                                // Add converstion to the result
                                let conversation = {
                                    _id: userObject.conversations[convId],
                                    date: convResult.messages[convResult.messages.length - 1].date,
                                    username: convUserRes.username
                                };
                                conversations.push(conversation);
                            });
                        }
                    }
                });
            }
        }
    );
    return conversations;
}



var convSockets = new Map();



convSocketNs.on('connect', function(socket){
   socket.on('message', function(data){
        //generate an ID for this socket
        //socket.id=uuidv4();
        // Save socket in map
        convSockets.set(data,socket.id);
        // Send initial data through socket
        getConversationsForUser(data).then((result)=> {
            console.log("Sendig");
            socket.emit('message',JSON.stringify(result));})
    });
   socket.on('disconnect', function(data){
      convSockets.delete(data);
   });
});


// Updates through socket for relevant userId.
function updateClient(userId){
    if (convSockets.has(userId)) {
        getConversationsForUser(userId).then((result) => {
            console.log("Sendig");
            convSocketNs.to(convSockets.get(userId)).emit('message', JSON.stringify(result));
        });
    }
}

// Creates new conversation
app.post('/conversations',
    async function(req,res) {
        // Create the conversation
        dbFuncs.createDoc(dbNames.conversations, {users: req.body.users, messages: []}).then(result => {
            // Insert an Initial message
            dbFuncs.appendArrayAttribute(dbNames.conversations, result, "messages",
                {sender: req.body.userid, date: new Date().getFullYear(), content: req.body.content}).then(
                function () {
                    // For each user update conversations field in userDB + update session with webSocket
                    for (let i = 0; i < req.body.users.length; i++) {
                        //Update user database with new conversation
                        dbFuncs.appendArrayAttribute(dbNames.users, req.body.users[i], "conversations", result).then(
                            function () {
                                updateClient(req.body.users[i])
                            }
                        );
                    }
                    res.end();
                })
        });
    });

/*
This function sends all messages of a specific conversation
 */
app.get("/conversations/:convId",function (req,res) {
            dbFuncs.getDoc(dbNames.conversations,req.params.convId).then((result) => {
        res.send(result.messages);
    })
});
