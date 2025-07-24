import React, { useState, useEffect } from 'react';
import './App.css';
import Swap from './components/Swap';

function App() {
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        console.log('Tentativo connessione wallet...');
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        console.log('Accounts ottenuti:', accounts);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Errore dettagliato:", error);
        alert('Errore nella connessione: ' + error.message);
      }
    } else {
      alert('MetaMask non trovato! Installa l\'estensione MetaMask.');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
  };

  // Controlla se il wallet è già connesso
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.log('Nessun wallet connesso');
        }
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>SwapBob DEX</h1>
        <div className="wallet-section">
          {account ? (
            <div className="account-info">
              <span>{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
              <button onClick={disconnectWallet} className="disconnect-btn">Disconnetti</button>
            </div>
          ) : (
            <button onClick={connectWallet} className="connect-btn">Connetti Wallet</button>
          )}
        </div>
      </header>
      
      <main className="app-main">
        {account ? (
          <Swap account={account} />
        ) : (
          <div className="welcome-section">
            <h2>Benvenuto su SwapBob</h2>
            <p>Connetti il tuo wallet per iniziare a fare swap</p>
            <p>Guadagna commissioni su ogni swap! Le fee vanno al tuo wallet.</p>
            <button onClick={connectWallet} className="large-connect-btn">Connetti Wallet</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;