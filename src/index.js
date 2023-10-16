import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import WebSocketComponent from './components/WebSocketComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WebSocketComponent/>
  </React.StrictMode>
  
);
