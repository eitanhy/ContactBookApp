import {appStore} from "./redux/store/reduxStore";
import React from 'react';

// Initial Context which holds the redux-store
export default React.createContext({store: appStore});