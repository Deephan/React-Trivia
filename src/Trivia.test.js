import React from 'react';
import ReactDOM from 'react-dom';
import Trivia from './js/Trivia';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Trivia />, div);
});
