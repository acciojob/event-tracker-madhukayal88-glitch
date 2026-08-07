import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Popup from 'react-popup';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);
