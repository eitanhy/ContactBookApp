import React from 'react';
import BasicSettingForm from './BasicSettingForm';


const PasswordForm = props =>{
    return <BasicSettingForm fields={[
        {name:'pass',description:'New Password', type:'password'},
        {name:'confPass',description:'Confirm Password', type:'password'},
    ]} />
};

export default PasswordForm;