import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('0.01');
  const [swapStatus, setSwapStatus] = useState('');
  const [error, setError] = useState('');
  const [chainId, setChainId] = useState(1);

  // Verifica connessione esistente al caricamento
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            handleConnectionSuccess(accounts[0]);
          }
        } catch (error) {
          console.error("Errore nel controllo connessione:", error);
        }
      }
    };

    checkConnection();
    
    // Ottieni chainId
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_chainId' })
        .then(chainId => {
          setChainId(parseInt(chainId, 16));
        });
    }
  }, []);

  const handleConnectionSuccess = (account) => {
    setAccount(account);
    setIsConnected(true);
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(web3Provider);
    setSigner(web3Provider.getSigner());
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleConnectionSuccess(accounts[0]);
        setError('');
        
        // Setup event listeners
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        
      } catch (err) {
        handleConnectionError(err);
      }
    } else {
      setError("Installa MetaMask o un wallet compatibile!");
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainIdHex) => {
    const chainId = parseInt(chainIdHex, 16);
    setChainId(chainId);
    setSwapStatus(`Rete cambiata: ${getNetworkName(chainId)}`);
    setTimeout(() => setSwapStatus(''), 3000);
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1: return 'Ethereum';
      case 137: return 'Polygon';
      case 56: return 'BSC';
      case 42161: return 'Arbitrum';
      default: return `Sconosciuta (${chainId})`;
    }
  };

  const handleConnectionError = (err) => {
    console.error("Errore connessione wallet:", err);
    
    if (err.code === 4001) {
      setError("Connessione annullata dall'utente");
    } else if (err.code === -32002) {
      setError("Richiesta già in corso. Apri MetaMask");
    } else {
      setError(`Errore: ${err.message || "Sconosciuto"}`);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount('');
    setProvider(null);
    setSigner(null);
    
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  // FUNZIONE SWAP CON FIRMA FUNZIONANTE
  const executeSwap = async () => {
    if (!provider || !signer) {
      setError("Wallet non connesso");
      return;
    }

    try {
      setSwapStatus("Preparazione swap...");
      setError('');
      
      // 1. Simuliamo una transazione di swap (questo è solo un esempio)
      // Nella realtà qui dovresti avere i dati reali dall'API di swap
      const amountInWei = ethers.utils.parseEther(amount);
      
      // 2. Costruisci l'oggetto transazione
      const tx = {
        to: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // Indirizzo DAI (esempio)
        value: amountInWei,
        data: "0x", // Dati vuoti per semplice trasferimento ETH
        gasLimit: 21000,
        chainId: chainId
      };
      
      // 3. Stima il gasPrice
      setSwapStatus("Stima costo gas...");
      const gasPrice = await provider.getGasPrice();
      tx.gasPrice = gasPrice;
      
      // 4. Invia la transazione per la firma
      setSwapStatus("Attesa firma nel wallet...");
      
      // DEBUG: Visualizza i dettagli della transazione
      console.log("Dettagli transazione:", tx);
      
      const transaction = await signer.sendTransaction(tx);
      
      // 5. Attendi la conferma
      setSwapStatus("Transazione inviata. Attesa conferma...");
      
      // DEBUG: Visualizza l'hash della transazione
      console.log("Hash transazione:", transaction.hash);
      
      const receipt = await transaction.wait();
      
      // 6. Verifica lo stato
      if (receipt.status === 1) {
        setSwapStatus("Swap completato con successo!");
      } else {
        setError("Transazione fallita");
        setSwapStatus('');
      }
      
    } catch (err) {
      console.error("Errore swap:", err);
      
      // Gestione errori specifici di MetaMask
      if (err.code === 4001) {
        setError("Firma annullata dall'utente");
      } else if (err.message.includes("insufficient funds")) {
        setError("Fondi insufficienti");
      } else if (err.message.includes("gas")) {
        setError("Problema con il gas");
      } else {
        setError(`Errore: ${err.message || "Sconosciuto"}`);
      }
      
      setSwapStatus('');
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
              <span className="network">{getNetworkName(chainId)}</span>
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
      {swapStatus && <div className="status-banner">{swapStatus}</div>}

      {isConnected && (
        <div className="swap-container">
          <h2>Swap Token</h2>
          
          <div className="swap-box">
            <div className="input-group">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
              />
              <select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
                <option value="ETH">ETH</option>
                <option value="USDT">USDT</option>
                <option value="DAI">DAI</option>
              </select>
            </div>
            
            <div className="swap-arrow">↓</div>
            
            <div className="input-group">
              <input type="text" placeholder="0.0" readOnly />
              <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
                <option value="USDC">USDC</option>
                <option value="ETH">ETH</option>
                <option value="WBTC">WBTC</option>
              </select>
            </div>
            
            <button 
              onClick={executeSwap} 
              className="swap-btn"
              disabled={swapStatus && !swapStatus.includes("completato")}
            >
              {swapStatus || "Scambia"}
            </button>
          </div>
          
          <div className="debug-info">
            <h3>Debug Info</h3>
            <p>Chain ID: {chainId} ({getNetworkName(chainId)})</p>
            <p>Provider: {provider ? "Connesso" : "Non connesso"}</p>
            <p>Signer: {signer ? "Pronto per firmare" : "Non pronto"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;