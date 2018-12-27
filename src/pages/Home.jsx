import React, { PureComponent, Component } from 'react';
import Menu from '../UIComponents/Menu';
import {Switch,Route,withRouter} from 'react-router';
import Conversations from './Conversations';
import Settings from './Settings';
import Activity from './ActivityOverview';
import {connect} from 'react-redux';
import {insertUserStateActionHandler} from '../redux/actions/userActions';
import {selectConversationHandler,getConversationsHandler,sendChatMessage,AddMessageHandler} from '../redux/actions/conversationActions';

// Application protected home component
class Home extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div id='app'>
        <Menu logoutDispatcher={this.props.logoutDispatcher}/>
        <div id='content'>
            <Switch>
                <Route path='/conversations' exact={true} render={() => <Conversations state={this.props.state.conversationStateReducer} dispatchers={{
                    dispatchSelectConversation : this.props.dispatchSelectConversation,
                    dispatchGetConversations: this.props.dipsatchGetConversations,
                dispatchSendChatMessage : this.props.dispatchSendChatMessage,
            dispatchHandleMessage : this.props.dispatchHandleMessage}
                } />}/>
                <Route path='/settings' exact={true} render ={() => <Settings userState={this.props.state.userStateReducer.user}/>}/>
                <Route path='/' exact={false} render={() => <Activity />}/>
            </Switch>
        </div>
        
        </div>;
    }
}


const mapStateToProps = state => {
    // if the initialState is not undefined
    if (state != undefined) {
        return Object.assign({}, {state: state});
    }
    return Object.assign({},{state: state})
}

// TODO: 
// Send store dispatch to conversation path instead
const mapDispatchToProps = (dispatch) => {
    return {
        dispatchGetUserState : async function(){dispatch(insertUserStateActionHandler())},
        dispatchSelectConversation : async function(id,username){dispatch(selectConversationHandler(id,username))},
        dipsatchGetConversations : async function(){dispatch(getConversationsHandler())},
        dispatchSendChatMessage : content => dispatch(sendChatMessage(content)),
        dispatchHandleMessage : conversation => dispatch(AddMessageHandler(conversation))
    };
};

const AppComponent = withRouter(connect(mapStateToProps,mapDispatchToProps)(Home));
export default AppComponent;