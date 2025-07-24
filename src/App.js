import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState('');
  const [error, setError] = useState('');

  // Controlla la connessione al caricamento
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            updateNetwork();
          }
        } catch (err) {
          setError("Errore nel recupero degli account");
        }
      }
    };

    checkConnection();
  }, []);

  // Aggiorna le info sulla rete
  const updateNetwork = async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setNetwork(getNetworkName(chainId));
      } catch (err) {
        setError("Impossibile ottenere la rete");
      }
    }
  };

  // Mappa ID rete a nome
  const getNetworkName = (chainId) => {
    switch (chainId) {
      case '0x1': return 'Ethereum';
      case '0x89': return 'Polygon';
      case '0x38': return 'Binance Smart Chain';
      case '0xa4b1': return 'Arbitrum';
      default: return `Sconosciuta (${chainId})`;
    }
  };

  // Connetti al wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Installa MetaMask o un wallet compatibile");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setAccount(accounts[0]);
      setIsConnected(true);
      updateNetwork();
      setError('');
      
      // Setup event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
    } catch (err) {
      handleConnectionError(err);
    }
  };

  // Gestione cambio account
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };

  // Gestione cambio rete
  const handleChainChanged = (chainId) => {
    setNetwork(getNetworkName(chainId));
  };

  // Disconnetti wallet
  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
    setNetwork('');
    setError('');
    
    // Rimuovi listener
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  // Gestione errori
  const handleConnectionError = (err) => {
    console.error("Errore connessione wallet:", err);
    
    // Messaggi di errore specifici
    if (err.code === 4001) {
      setError("Connessione annullata dall'utente");
    } else if (err.code === -32002) {
      setError("Richiesta già in corso. Apri MetaMask per completare");
    } else {
      setError(`Errore: ${err.message || "Sconosciuto"}`);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>SwapBob</h1>
        <div className="wallet-info">
          {isConnected ? (
            <div className="connected">
              <span className="address">{`${account.substring(0, 6)}...${account.substring(38)}`}</span>
              <span className="network">{network}</span>
              <button onClick={disconnectWallet} className="disconnect-btn">
                Disconnetti
              </button>
            </div>
          ) : (
            <button onClick={connectWallet} className="connect-btn">
              Connetti Wallet
            </button>
          )}
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {isConnected ? (
        <main>
          <div className="success-message">
            <h2>Connessione Riuscita!</h2>
            <p>Wallet connesso correttamente a {network}</p>
          </div>
        </main>
      ) : (
        <div className="welcome">
          <h2>Benvenuto in SwapBob</h2>
          <p>Connetti il tuo wallet per iniziare</p>
          <button onClick={connectWallet} className="big-connect-btn">
            Connetti Wallet
          </button>
          
          <div className="troubleshooting">
            <h3>Problemi di connessione?</h3>
            <ol>
              <li>Assicurati di avere un wallet installato (MetaMask, Trust Wallet, ecc.)</li>
              <li>Se usi MetaMask, sbloccalo e aggiorna la pagina</li>
              <li>Controlla eventuali estensioni in conflitto</li>
              <li>Prova con un browser diverso</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;