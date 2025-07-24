import React, { useState, useEffect } from 'react';
import './App.css';
import Swap from './components/Swap';

function App() {
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState(1);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const chain = await window.ethereum.request({ method: 'eth_chainId' });
        setAccount(accounts[0]);
        setChainId(parseInt(chain, 16));
      } catch (error) {
        console.error("Errore connessione wallet:", error);
      }
    } else {
      alert('MetaMask non trovato!');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
      });
      
      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(parseInt(chainId, 16));
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>SwapBob DEX</h1>
        <div className="wallet-section">
          {account ? (
            <div className="account-info">
              <span>{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
              <span className="chain-indicator">
                {chainId === 1 ? 'Ethereum' : 
                 chainId === 56 ? 'BSC' : 
                 chainId === 137 ? 'Polygon' : 'Chain: ' + chainId}
              </span>
              <button onClick={disconnectWallet} className="disconnect-btn">Disconnetti</button>
            </div>
          ) : (
            <button onClick={connectWallet} className="connect-btn">Connetti Wallet</button>
          )}
        </div>
      </header>
      
      <main className="app-main">
        {account ? (
          <Swap account={account} chainId={chainId} />
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