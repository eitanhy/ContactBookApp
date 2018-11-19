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
        if (messageSockets.has(data)){
            messageSockets.get(data).push(socket.id);
        }
        else{
            messageSockets.set(data,[socket.id]);
        }
        // Send initial data through socket
    });
    socket.on('disconnect', function(data){
        let index=undefined;
        if (messageSockets.has(data)) {
            index = messageSockets.get(data).indexOf(socket.id);
        }
        if (index) {
            messageSockets.get(data).splice(index, 1);
        }
    });
});


// Updates through socket for relevant conversation.
function updateClient(convID){
    if (messageSockets.has(convID)) {
        getLatestMessageForConversation(convID).then((result) => {
            let sockets = messageSockets.get(convID);
            for (let messageSocket in sockets) {
                messageSocketNs.to(sockets[messageSocket]).emit('message', JSON.stringify(result));
            }
        });
    }
}

app.post("/messages/:conversationID", function(req,res){
   dbFuncs.appendArrayAttribute(dbNames.conversations,req.params.conversationID,"messages",{
       sender: req.body.userID,
       content: req.body.content,
       date : new Date().toDateString()
   }).then(() => updateClient((req.params.conversationID)));
   res.end();
});


app.get("/messages/:conversationID", function(req,res){
    dbFuncs.queryDB(dbNames.conversations,{_id:req.params.conversationID},["messages"]).then((response) => {
         res.send(response.docs[0].messages);
})});
