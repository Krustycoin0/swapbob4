import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ethers } from 'ethers';

// Esponi ethers globalmente per compatibilità
window.ethers = ethers;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);