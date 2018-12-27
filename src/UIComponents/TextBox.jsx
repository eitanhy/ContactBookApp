import React from 'react';


// Active Chat Text Box
const TextBox = props =>{
    return <div className='TextArea'>
        <input id='ChatMessageText' type='textarea'>{props.value}</input>
        <button className='btn btn-primary float-right' onClick={e =>{ 
            props.onClick(document.getElementById("ChatMessageText").value);
            document.getElementById("ChatMessageText").value ="";
        }}>Send</button>
    </div>
}

export default TextBox;