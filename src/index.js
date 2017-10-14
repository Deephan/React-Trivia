import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Timer from './Timer';

ReactDOM.render(<App />, document.getElementById('root'));
//ReactDOM.render(<Timer start={Date.now()} />, document.getElementById('progressStatus'));
registerServiceWorker();
