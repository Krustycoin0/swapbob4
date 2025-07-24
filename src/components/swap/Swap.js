import React, { useEffect } from 'react';
import { LiFiWidget } from '@lifi/widget';
import './Swap.css';

const Swap = ({ account }) => {
  useEffect(() => {
    console.log('Account ricevuto nel componente Swap:', account);
  }, [account]);

  // Configurazione LIFI
  const widgetConfig = {
    integrator: 'SwapBob-Dex',
    apiKey: '37f3b0ae-58d0-423a-a895-133cd60f2b72.20bd41f0-014e-4389-9dfa-9eaefb8589e5',
    variant: 'wide',
    appearance: 'light',
    fee: 0.3,
    feeAddress: account,
    slippage: 0.5,
    theme: {
      palette: {
        primary: { main: '#667eea' },
        secondary: { main: '#764ba2' }
      }
    }
  };

  return (
    <div className="swap-container">
      <div className="swap-card">
        <h2>Swap Token</h2>
        <p className="fee-info-text">
          Fee 0.3% → Wallet: {account?.substring(0, 6)}...{account?.substring(account?.length - 4)}
        </p>
        
        <div className="widget-wrapper">
          <LiFiWidget config={widgetConfig} integrator="SwapBob-Dex" />
        </div>
      </div>
    </div>
  );
};

export default Swap;