import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <App />, 
    document.getElementById('root') as HTMLElement 
    // getElementById's return type is HTMLElement | null (when it can't find an element). We're assuming that getElementById will actually succeed.
    // we need to convince TypeScript of that using the as syntax.
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
