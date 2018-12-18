import React from 'react';
const AddButton = React.memo(props => {
    return <div className='mx-auto AddButton'>
            <span>+ Add Conversation</span>
        </div>
});

export default AddButton;