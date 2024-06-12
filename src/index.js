import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { TerminalProvider } from './context/TerminalContext';
import App from "./components/App";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TerminalProvider>
      <App/>
    </TerminalProvider>  
  </React.StrictMode>
  
);
