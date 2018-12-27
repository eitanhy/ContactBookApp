import React from 'react';
import BasicSettingForm from './BasicSettingForm';

// Basic Information Settings Form
const BasicInformation = props =>{
    return <BasicSettingForm fields={[
        {name:'first',description:'First Name', type:'text' ,value: props.userState.firstname},
        {name:'last',description:'Last Name', type:'text', value: props.userState.lastname},
        {name:'email',description:'Email', type:'email', value: props.userState.email},
        {name:'tel',description:'Telephone Number', type:'text', value: props.userState.telephone},
    ]} />
};

export default BasicInformation;