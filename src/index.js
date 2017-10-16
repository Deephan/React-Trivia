import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Trivia from './js/Trivia';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Trivia />, document.getElementById('root'));
registerServiceWorker();
