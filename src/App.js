import React, { useState, useEffect } from 'react';
import './App.css';
import Swap from './components/Swap';

function App() {
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState(1);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Richiedi l'accesso all'account
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        // Ottieni la chain ID
        const chain = await window.ethereum.request({ 
          method: 'eth_chainId' 
        });
        
        setAccount(accounts[0]);
        setChainId(parseInt(chain, 16));
        
        console.log('Wallet connesso:', accounts[0]);
        console.log('Chain ID:', parseInt(chain, 16));
      } catch (error) {
        console.error("Errore connessione wallet:", error);
        alert('Errore nella connessione al wallet. Assicurati di avere MetaMask installato e sbloccato.');
      }
    } else {
      alert('MetaMask non trovato! Installa MetaMask per continuare.');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    console.log('Wallet disconnesso');
  };

  // Gestione cambio account e chain
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // L'utente ha disconnesso il wallet
        setAccount('');
        console.log('Wallet disconnesso dall\'utente');
      } else {
        // L'utente ha cambiato account
        setAccount(accounts[0]);
        console.log('Account cambiato:', accounts[0]);
      }
    };

    const handleChainChanged = (chainId) => {
      setChainId(parseInt(chainId, 16));
      console.log('Chain cambiata:', parseInt(chainId, 16));
      // Ricarica la pagina quando cambia la chain
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
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
                 chainId === 137 ? 'Polygon' : 
                 chainId === 43114 ? 'Avalanche' : 
                 chainId === 250 ? 'Fantom' : 'Chain: ' + chainId}
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