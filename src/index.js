import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>// Esempio di utilizzo
import { walletService, swapService } from './services/index.js';

// Connessione
const connectBtn = document.getElementById('connect-wallet');
connectBtn.addEventListener('click', async () => {
  const result = await walletService.connectWallet();
  if (result.success) {
    console.log('Connesso:', result.address);
  } else {
    console.error('Errore:', result.error);
  }
});

// Swap
const swapBtn = document.getElementById('swap-button');
swapBtn.addEventListener('click', async () => {
  const result = await swapService.executeSwap(
    tokenInAddress,
    tokenOutAddress,
    amountToSwap
  );
  
  if (result.success) {
    console.log('Swap completato:', result.transactionHash);
  } else {
    console.error('Swap fallito:', result.error);
  }
}
);
