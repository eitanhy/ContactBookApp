// API for conversation actions
const uuidv4 = require('uuid/v4');
var dbFuncs = module.parent.exports.dbFuncs,
    dbNames = module.parent.exports.consts.customParams.dbNames,
    app = module.parent.exports.app;

// Returns all basic conversation info for required user
app.get('/api/conversations/:id', function (req, res) {
    getConversationsForUser(req.params.id).then(result => res.send(result.reverse()));
});

async function getConversationsForUser(userId) {
    let conversations = [];
    let userObject = await dbFuncs.getDoc(dbNames.users, userId);
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
                            id: userObject.conversations[convId],
                            date: convResult.messages[convResult.messages.length - 1].date,
                            username: convUserRes.username,
                            userid: convResult.messages[convResult.messages.length - 1].sender,
                            latest: convResult.messages[convResult.messages.length - 1].content
                        };
                        conversations.push(conversation);
                    });
                }
            }
        });
    }

    return conversations;
}
