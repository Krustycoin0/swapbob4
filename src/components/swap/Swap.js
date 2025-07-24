import React, { useState, useEffect } from 'react';
import { LiFiWidget } from '@lifi/widget';
import './Swap.css';

const Swap = ({ account, chainId }) => {
  const [showLifiWidget, setShowLifiWidget] = useState(false);
  const [fee, setFee] = useState(0.3); // 0.3% fee per l'utente

  // Configurazione LIFI con fee nel wallet dell'utente
  const widgetConfig = {
    integrator: 'SwapBob-Dex',
    apiKey: '37f3b0ae-58d0-423a-a895-133cd60f2b72.20bd41f0-014e-4389-9dfa-9eaefb8589e5',
    variant: 'wide',
    appearance: 'light',
    fromChain: chainId,
    toChain: chainId,
    fee: fee, // Percentuale di fee
    feeAddress: account, // Il wallet dell'utente riceve le fee
    slippage: 0.5,
    hiddenUI: ['appearance', 'language'],
    theme: {
      palette: {
        primary: { 
          main: '#667eea' 
        },
        secondary: { 
          main: '#764ba2' 
        },
        background: { 
          paper: '#ffffff',
          default: '#f8f9fa'
        }
      }
    }
  };

  // Chain configurate
  const getChainName = () => {
    switch(chainId) {
      case 1: return 'Ethereum';
      case 56: return 'BSC';
      case 137: return 'Polygon';
      case 43114: return 'Avalanche';
      case 250: return 'Fantom';
      default: return 'Ethereum';
    }
  };

  return (
    <div className="swap-container">
      <div className="swap-card">
        <h2>Swap Token con Fee</h2>
        <p className="fee-info-text">
          Guadagna il {fee}% di fee su ogni swap! Le commissioni vanno direttamente al tuo wallet.
        </p>
        
        <div className="chain-info">
          <span>Chain attiva: {getChainName()}</span>
          <span>Wallet fee: {account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
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
            <li>Ogni swap genera una commissione del {fee}%</li>
            <li>Le commissioni vengono inviate automaticamente al tuo wallet</li>
            <li>Non ci sono costi aggiuntivi per te</li>
            <li>Guadagno passivo su ogni transazione</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Swap;