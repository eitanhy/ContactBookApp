// API for messages

var dbFuncs =  module.parent.exports.dbFuncs,
    dbNames = module.parent.exports.consts.customParams.dbNames,
    app = module.parent.exports.app,
    io = module.parent.exports.io,
    server = module.parent.exports.server;

var messageSocketNs = io.of('messagestream');

var messageSockets = new Map();

async function getLatestMessageForConversation(conversationID){
    return dbFuncs.queryDB(dbNames.conversations,{_id:conversationID},["messages"]).then((response) => {
        return response.docs[0].messages.reverse()[0]});
}

messageSocketNs.on('connect', function(socket){
    socket.on('message', function(data){
        //generate an ID for this socket
        //data is conversationID
        // Save socket in map
            messageSockets.set(data,socket.id);
        // Send initial data through socket
    });
    socket.on('disconnect', function(data){
        if (messageSockets.has(data)) {
            messageSockets.set(data,undefined);
        }
    });
});


// Updates relevant users WebSocket 
function updateClient(conversation){
    dbFuncs.queryDB(dbNames.conversations,{_id:conversation.id},["users"]).then( 
    response =>{
        response.docs[0].users.forEach(userId => {
            if (messageSockets.has(userId)){
                let target = userId == response.docs[0].users[0] ? response.docs[0].users[1] : response.docs[0].users[0];
                dbFuncs.queryDB(dbNames.users,{_id : target},["username"]).then(
                    userResult => {
                        conversation.username = userResult.docs[0].username;
                        messageSocketNs.to(messageSockets.get(userId)).emit('message', JSON.stringify(conversation));
                    }
                )
            }
        });
    });
}
             
// Creates a message for required conversation
app.post("/api/messages/:id", function(req,res){
    let conversationObject = {
        id : req.params.id,
        userid : req.body.sender,
        date : new Date().toDateString(),
        latest: req.body.content
    };
   dbFuncs.appendArrayAttribute(dbNames.conversations,conversationObject.id,"messages",{
       sender: req.body.sender,
       content: conversationObject.latest,
       date : conversationObject.date
   }).then(()=> {
        updateClient(conversationObject)}
       );
   res.end();
});

// Get all messages of a required conversation
app.get("/api/messages/:conversationID", function(req,res){
    dbFuncs.queryDB(dbNames.conversations,{_id:req.params.conversationID},["messages"]).then((response) => {
         res.send(response.docs[0].messages);
})});



// Creates a new conversation
app.post('/api/conversations',
    async function (req, res) {
        // Create the conversation
        dbFuncs.createDoc(dbNames.conversations, { users: req.body.users, messages: [] }).then(result => {
            // Insert an Initial message
            // initial message
            const message = { sender: req.body.users[0].id, date: new Date().toDateString(), content: req.body.content }
            dbFuncs.appendArrayAttribute(dbNames.conversations, result, "messages",message
                ).then(
                    function () {
                        // For each user update conversations field in userDB + update session with webSocket
                        for (let i = 0; i < req.body.users.length; i++) {
                            //Update user database with new conversation
                            dbFuncs.appendArrayAttribute(dbNames.users, req.body.users[i], "conversations", result).then(
                                function () {
                                    updateClient({id: result,date: message.date, userid: users[0].id, latest: message.content});
                                }
                            );
                        }
                        res.end();
                    })
        });
    });