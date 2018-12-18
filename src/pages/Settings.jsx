import React from 'react';
import ReactDOM from 'react-dom';
import BasicInfo from '../UIComponents/BasicInformation';
import PassForm from '../UIComponents/PasswordForm';
import '../styles/sheets/Settings.scss';

const SettingMenu = function(props){
    return <ul className="nav justify-content-center bg-info pb-1 pt-1 rounded">
        {props.options.map(option =>{
            console.log(option);
            return <li className="nav-item mr-1">
                    <button type='button' className="btn btn-light" onClick={()=> option.onClick()}>
                        {option.title}
                    </button>
            </li>
        })}
    </ul>;
}

class Settings extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    toggleForm(name){
            this.setState({toggled: name})
    }
    formRouter(toggled){
        switch (toggled) {
            case "Password":
                return <PassForm />
                break;
        
            default:
                return (this.props.userState) ? <BasicInfo userState={this.props.userState}/> : null;
                break;
        }
    }
    render(){
        return <div id='Settings' className="w-50 mx-auto border">
                <SettingMenu options={[
                    {title: 'Basic Information', onClick: this.toggleForm.bind(this,['Basic'])},
                    {title:'Password', onClick: this.toggleForm.bind(this,['Password'])}
                ]} />
                
                {this.formRouter.call(this,this.state.toggled)}
            </div>;    
    }
}

export default Settings;