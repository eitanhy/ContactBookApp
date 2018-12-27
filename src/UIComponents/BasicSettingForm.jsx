import React from 'react';

// Adjustable form for settings & login
const BasicSettingForm = props=>{
    return <div className="form-group">
    {props.fields.map(field => {
        return <div className='ml-2 mr-2'><label for={field.name}>{field.description}</label>
            <input id={field.name} type={field.type} className="form-control" defaultValue={field.value ? field.value : null}/>
            </div>
    })}
        <button type="submit" className='btn btn-block btn-primary mt-1 w-25 mx-auto' onClick={props.onSubmit}>
            {props.submitText ? props.submitText : 'Apply'}
        </button>
    </div>
};

export default BasicSettingForm;