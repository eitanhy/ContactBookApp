import {appStore} from "./redux/store/reduxStore";
import React from 'react';

// Initial Context which holds the redux-store, currently not in use by app- only by login interface

export default React.createContext({store: appStore});