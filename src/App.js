import React, { useState, useEffect } from 'react';
import WalletConnect from './components/WalletConnect';
import SwapInterface from './components/SwapInterface';
import LiFi from '@lifi/sdk';
import { ethers } from 'ethers';
import './App.css';

const LIFI_API_KEY = '37f3b0ae-58d0-423a-a895-133cd60f2b72.20bd41f0-014e-4389-9dfa-9eaefb8589e5';

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [lifi, setLifi] = useState(null);
  const [chainId, setChainId] = useState(1);

  // Inizializza LiFi
  useEffect(() => {
    const lifiInstance = new LiFi({
      apiKey: LIFI_API_KEY,
      defaultRouteOptions: {
        integrator: 'SwapBobApp'
      }
    });
    setLifi(lifiInstance);
  }, []);

  // Gestione connessione wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        
        // Ottieni chainId corrente
        const network = await web3Provider.getNetwork();
        setChainId(network.chainId);
        
        // Listener per cambi di account
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0] || '');
        });
        
        // Listener per cambi di chain
        window.ethereum.on('chainChanged', (chainId) => {
          setChainId(parseInt(chainId, 16));
          window.location.reload();
        });
        
      } catch (error) {
        console.error("Errore connessione wallet:", error);
      }
    } else {
      alert("Installa MetaMask!");
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>SwapBob</h1>
        <WalletConnect 
          account={account} 
          connectWallet={connectWallet} 
        />
      </header>
      
      <main className="app-main">
        {account ? (
          <SwapInterface 
            account={account} 
            provider={provider}
            lifi={lifi}
            chainId={chainId}
          />
        ) : (
          <div className="connect-prompt">
            <p>Connetti il tuo wallet per iniziare</p>
            <button onClick={connectWallet}>Connetti Wallet</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;