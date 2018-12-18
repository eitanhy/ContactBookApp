import React, { PureComponent, Component } from 'react';
import Menu from '../UIComponents/Menu';
import {Switch,Route,withRouter} from 'react-router';
import Conversations from './Conversations';
import Settings from './Settings';
import Activity from './ActivityOverview';
import {connect} from 'react-redux';
import {insertUserStateActionHandler} from '../redux/actions/userActions';
import {selectConversationHandler,getConversationsHandler} from '../redux/actions/conversationActions';
class Home extends Component{
    constructor(props){
        super(props);
        //this.props.dispatchGetUserState();
    }
    render(){
        console.log(this.props.state);
        return <div id='app'>
        <Menu logoutDispatcher={this.props.logoutDispatcher}/>
        <div id='content'>
            <Switch>
                <Route path='/conversations' exact={true} render={() => <Conversations state={this.props.state.conversationStateReducer} dispatchers={{
                    dispatchSelectConversation : this.props.dispatchSelectConversation,
                    dispatchGetConversations: this.props.dipsatchGetConversations}
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

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchGetUserState : async function(){dispatch(insertUserStateActionHandler())},
        dispatchSelectConversation : async function(id){dispatch(selectConversationHandler(id))},
        dipsatchGetConversations : async function(){dispatch(getConversationsHandler())}
    };
};

const AppComponent = withRouter(connect(mapStateToProps,mapDispatchToProps)(Home));
export default AppComponent;