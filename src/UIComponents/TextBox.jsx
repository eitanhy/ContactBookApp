import React from 'react';

const TextBox = React.memo(props =>{
    return <div className='TextArea'>
        <input type='textarea'></input>
        <button className='btn btn-primary float-right'>Send</button>
    </div>
})

export default TextBox;