import React from 'react';
import { LiFiWidget } from '@lifi/widget';
import './Swap.css';

const Swap = ({ account }) => {
  // Configurazione LIFI con fee nel wallet dell'utente
  const widgetConfig = {
    integrator: 'SwapBob-Dex',
    apiKey: '37f3b0ae-58d0-423a-a895-133cd60f2b72.20bd41f0-014e-4389-9dfa-9eaefb8589e5',
    variant: 'wide',
    appearance: 'light',
    fee: 0.3, // 0.3% fee
    feeAddress: account, // Il wallet dell'utente riceve le fee
    slippage: 0.5,
    theme: {
      palette: {
        primary: { 
          main: '#667eea' 
        },
        secondary: { 
          main: '#764ba2' 
        }
      }
    }
  };

  return (
    <div className="swap-container">
      <div className="swap-card">
        <h2>Swap Token con Fee</h2>
        <p className="fee-info-text">
          Guadagna il 0.3% di fee su ogni swap! Le commissioni vanno direttamente al tuo wallet.
        </p>
        
        <div className="wallet-info">
          <p>Wallet fee: <strong>{account.substring(0, 6)}...{account.substring(account.length - 4)}</strong></p>
        </div>

        <div className="widget-wrapper">
          <LiFiWidget 
            config={widgetConfig} 
            integrator="SwapBob-Dex" 
          />
        </div>

        <div className="commission-info">
          <h3>Come funzionano le commissioni</h3>
          <ul>
            <li>0.3% di fee su ogni swap</li>
            <li>Le fee vanno al tuo wallet</li>
            <li>Nessun costo aggiuntivo</li>
            <li>Guadagno automatico</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Swap;