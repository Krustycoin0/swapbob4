import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [network, setNetwork] = useState('');

  // Controlla se MetaMask è installato
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined';
  };

  // Connetti al wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert("Installa MetaMask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setAccount(accounts[0]);
      setIsConnected(true);
      
      // Crea il provider ethers
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethersProvider);
      
      // Ottieni la rete
      const network = await ethersProvider.getNetwork();
      setNetwork(network.name);
      
      // Aggiungi listener per cambi di account
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Aggiungi listener per cambi di rete
      window.ethereum.on('chainChanged', handleChainChanged);
      
    } catch (error) {
      console.error("Errore connessione wallet:", error);
      alert(`Errore: ${error.message}`);
    }
  };

  // Gestisci cambio account
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // Wallet disconnesso
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };

  // Gestisci cambio rete
  const handleChainChanged = (chainId) => {
    window.location.reload();
  };

  // Disconnetti wallet
  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
    setProvider(null);
    setNetwork('');
    
    // Rimuovi listener
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  // Prova a riconnettere automaticamente
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled() && window.ethereum.selectedAddress) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          connectWallet();
        }
      }
    };

    checkConnection();
  }, []);

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

      {isConnected && (
        <main>
          <div className="balance-section">
            <h2>Il tuo Portafoglio</h2>
            <div className="tokens">
              <div className="token">
                <span className="symbol">ETH</span>
                <span className="balance">0.00</span>
              </div>
              <div className="token">
                <span className="symbol">USDC</span>
                <span className="balance">0.00</span>
              </div>
            </div>
          </div>

          <div className="swap-section">
            <h2>Swap Token</h2>
            <div className="swap-box">
              <div className="input-group">
                <input type="number" placeholder="0.0" />
                <select>
                  <option>ETH</option>
                  <option>USDC</option>
                </select>
              </div>
              
              <div className="swap-arrow">↓</div>
              
              <div className="input-group">
                <input type="number" placeholder="0.0" />
                <select>
                  <option>USDC</option>
                  <option>ETH</option>
                </select>
              </div>
              
              <button className="swap-btn">Scambia</button>
            </div>
          </div>
        </main>
      )}
      
      {!isConnected && (
        <div className="welcome">
          <h2>Benvenuto in SwapBob</h2>
          <p>Connetti il tuo wallet per iniziare a fare trading</p>
          <button onClick={connectWallet} className="big-connect-btn">
            Connetti Wallet
          </button>
          <div className="wallets">
            <p>Supportiamo:</p>
            <div className="wallet-icons">
              <span>MetaMask</span>
              <span>Trust Wallet</span>
              <span>Coinbase Wallet</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;