import React from 'react';

export default class MessagesLogo extends React.Component{
    render(){
        return <svg
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 230.17 230.17"
            style={{ enableBackground: "new 0 0 230.17 230.17" }}
            xmlSpace="preserve" onClick={this.props.onClick}>
            <path d="M230 49.585c0-.263.181-.519.169-.779l-70.24 67.68 70.156 65.518c.041-.468-.085-.94-.085-1.418V49.585zm-80.793 77.316l-28.674 27.588a7.48 7.48 0 0 1-5.2 2.096 7.478 7.478 0 0 1-5.113-2.013l-28.596-26.647-70.614 68.064c1.717.617 3.56 1.096 5.49 1.096h197.667c2.866 0 5.554-.873 7.891-2.175l-72.851-68.009z" />
            <path d="M115.251 138.757L222.447 35.496c-2.427-1.443-5.252-2.411-8.28-2.411H16.5c-3.943 0-7.556 1.531-10.37 3.866l109.121 101.806zM0 52.1v128.484c0 1.475.339 2.897.707 4.256l69.738-67.156L0 52.1z" />
        </svg>;

    }
}