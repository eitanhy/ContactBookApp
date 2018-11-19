import React from 'react';
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {mapStateToProps} from './redux/actions/userActions'
import '../styles/home.scss';
import NavigationLogo from './navigationLogo';
import SettingsLogo from './settingsLogo';
import MessagesLogo from './messagesLogo';
import AccountSettings from './AccountSettings';
import Conversations from './conversations';
// Class of the main user homepage


class Home extends React.Component{
    constructor(props){
        super(props);
        console.log(props);
        this.style = {
            backgroundColor : props.state.settings.primaryColor,
        };
        this.onSettingsClick = this.onSettingsClick.bind(this);
        this.onMessagesClick = this.onMessagesClick.bind(this);
        this.state = {pageHeader : 'Activity Overview'};
    }

    onSettingsClick(){
        this.setState({pageHeader : 'Account Settings'});
        ReactDOM.render(<AccountSettings state={this.props.state}dispatch={this.props.store.dispatch}/>,document.getElementById("content"));
    }
    onMessagesClick(){
        this.setState({pageHeader : 'Messages'});
        ReactDOM.render(<Conversations state={this.props.state}/>,document.getElementById("content"));
    }
    render(){
        return <div id={"home"}>
                <div className={"sideNav"} style={{backgroundColor : this.props.state.settings.primaryColor}}>
                    <div className={"sideNavHeader"}>
                        <NavigationLogo/>
                        <span onClick={() => this.setState({pageHeader: "Activity Overview"})}>ContactBook
                        </span>
                    </div>
                    <div className={"sideNavMenu"}>
                        <div className={"sideNavItem"} >
                            <SettingsLogo onClick={this.onSettingsClick}/>
                            <div className={"sideNavItemText"}>Account Settings</div>
                        </div>
                        <div className={"sideNavItem"} >
                            <MessagesLogo onClick={this.onMessagesClick}/>
                            <div className={"sideNavItemText"}>Messages</div>
                        </div>
                    </div>
                </div>
                <div className={"pageHeader"}>
                    <span className={'pageHeaderText'}>{this.state.pageHeader}</span>
                </div>
                <div id={"content"}/>
            </div>;
    }
}

// Link props.state to the Redux store user value.


export default connect(mapStateToProps)(Home);



