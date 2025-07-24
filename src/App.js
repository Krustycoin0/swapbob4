import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  // Verifica lo stato della connessione al caricamento
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            initProvider();
          }
        } catch (error) {
          console.error("Errore nel controllo della connessione:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Inizializza il provider e il signer
  const initProvider = () => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(web3Provider);
    setSigner(web3Provider.getSigner());
  };

  // Gestione della connessione al wallet
  const connectWalletHandler = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
        initProvider();
        
        // Aggiungi listener per cambi di account
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            disconnectWalletHandler();
          } else {
            setAccount(accounts[0]);
          }
        });
        
        // Aggiungi listener per cambi di rete
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
        
      } catch (error) {
        console.error("Errore nella connessione:", error);
      }
    } else {
      alert("Installa MetaMask o un wallet compatibile!");
    }
  };

  // Gestione della disconnessione
  const disconnectWalletHandler = () => {
    setIsConnected(false);
    setAccount('');
    setProvider(null);
    setSigner(null);
    
    // Rimuovi gli event listener
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  };

  return (
    <div className="App">
      <header>
        <h1>La Mia App</h1>
        <div className="wallet-section">
          {isConnected ? (
            <div className="wallet-connected">
              <span className="wallet-address">{`${account.substring(0, 6)}...${account.substring(38)}`}</span>
              <button onClick={disconnectWalletHandler} className="disconnect-button">
                Disconnetti
              </button>
            </div>
          ) : (
            <button onClick={connectWalletHandler} className="connect-button">
              Connetti Wallet
            </button>
          )}
        </div>
      </header>

      {isConnected && (
        <main>
          <div className="wallet-info">
            <h2>Wallet Connesso</h2>
            <p>Indirizzo: {account}</p>
            <p>Stato: Connesso</p>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;