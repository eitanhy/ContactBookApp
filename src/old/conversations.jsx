import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../styles/messages.scss'
import io from 'socket.io-client';
import Messages from './messages';
import AddConversation from './AddConversation';
export default class Conversations extends React.Component{
    componentDidMount() {

        // Open ws connection related to conversations
        this.convSocket = io(`${window.location.protocol == 'http' ? 'http' : 'https'}://${window.location.hostname}/convstream`);
        this.convSocket.on('connect', function (event) {
            this.convSocket.emit('message',this.props.state._id);
            this.convSocket.on('message',this.onWebSocketMessage);
        }.bind(this));

        this.conversationItems = this.conversationItems.bind(this);
        this.onAddConversation = this.onAddConversation.bind(this);
    }

    // refresh conversation data, if no conversation is selected, open the latest conversation messages
    onWebSocketMessage(data){
        this.setState({conversations: JSON.parse(data).reverse()}, () => {
            if (!this.state.selectedConversation){
                this.setState({selectedConversation : this.state.conversations[0]._id}, ()=> {
                ReactDOM.render(<Messages userId={this.props.state._id} userName= {this.props.state.username}
                                        otherUser={this.state.conversations[0].username} conversationID ={this.state.conversations[0]._id}/>,
                    document.getElementById(this.state.conversations[0]._id));});
            }
        });
    }
    constructor(props){
        super(props);
        this.state={};
        this.onWebSocketMessage = this.onWebSocketMessage.bind(this);
    }

    // Declare in the ws connection we want to recieve conversations for logged in user
    refreshConversations(){
        this.convSocket.emit('message',this.props.state._id);
    }



    // Conversation Click behaviour
    async onItemClick(conversation){
        let selectedConversation;

        // close the previous opened conversation, if exists
        if (this.state.selectedConversation != undefined){

            ReactDOM.render(null,document.getElementById(this.state.selectedConversation));
            selectedConversation = undefined;
        }

        // if the previous selected conversation isn't the current one, reveal the newly selected conversation
        // Rendering is with  the conversationId which is the id of the containing div.
        else if (this.selectedConversation != conversation._id) {
            console.log(conversation);
            ReactDOM.render(<Messages userId={this.props.state._id} userName={this.props.state.username}
                                      otherUser={conversation.username} conversationID={conversation._id} onClick={this.refreshConversations.bind(this)}/>,
                document.getElementById(conversation._id));
            selectedConversation = conversation._id;
        }
        this.setState({selectedConversation: selectedConversation});
    }


    // Build the conversation list
    conversationItems(conversations){
        if (conversations) {
            console.log(conversations);
            let result = conversations.map(conversation => {
               return <div className={"messageItem"} style={{backgroundColor: this.props.state.settings.primaryColor}}>
                    <div className={"messageHeader"} onClick={(e) => this.onItemClick(conversation)}>
                        <div className={"details"}>
                            <div className={"detail"}>
                                <div className={"detailDesc"}>
                                    Conversation With:
                                </div>
                                <div className={"detailValue"}>
                                    {conversation.username}
                                </div>
                            </div>
                            <div className={"detail"}>
                                <div className={"detailDesc"}>
                                    Latest Message:
                                </div>
                                <div className={"detailValue"}>
                                    {conversation.date}
                                </div>
                            </div>
                        </div>
                    </div>
                   <div className={"conversationMessages"} id={conversation._id} />
                </div>
            });
            return result;
        }
    }

    // Adding a new conversation
    onAddConversation(e){
        let render = null;
        if (this.state.addConversationOpen){
            e.target.innerText = "Add Conversation";
            this.setState({addConversationOpen: false});
        }
        else{
            e.target.innerText = "Close";
            render = <AddConversation _id={this.props.state._id} />;
            this.setState({addConversationOpen: true});
        }
        ReactDOM.render(render,document.getElementById("addConversationForm"));
    }

    render(){
        return <div>
        <div className={"AddConversationArea"}>
            <div className={"addConversationButton"} onClick={this.onAddConversation}
                 style={{backgroundColor: this.props.state.settings.primaryColor}}>
                Add Conversation
            </div>
            <div id={"addConversationForm"} />
        </div>
        <div className={"conversationContainer"}>
            {this.conversationItems(this.state.conversations)}
            </div>
        </div>
    }
}