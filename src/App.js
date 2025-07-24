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

  const handleChainChanged = () => {
    window.location.reload();
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

  // FUNZIONE SWAP FUNZIONANTE (esempio con Uniswap)
  const executeSwap = async () => {
    if (!provider || !signer) {
      setError("Wallet non connesso");
      return;
    }

    try {
      setSwapStatus("Preparazione swap...");
      
      // Configurazione token (esempio)
      const tokenIn = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'; // ETH
      const tokenOut = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC
      const amountIn = ethers.utils.parseEther(amount);
      
      // Configurazione swap (adatta al tuo caso)
      const swapParams = {
        fromTokenAddress: tokenIn,
        toTokenAddress: tokenOut,
        amount: amountIn.toString(),
        fromAddress: account,
        slippage: 1,
        disableEstimate: false,
        allowPartialFill: false,
      };

      // 1. Ottieni quote di swap (API esterna)
      setSwapStatus("Recupero quote...");
      const quoteResponse = await fetch(
        `https://api.1inch.io/v5.0/1/quote?` + 
        new URLSearchParams(swapParams)
      );
      
      if (!quoteResponse.ok) throw new Error("Errore quote swap");
      
      const quoteData = await quoteResponse.json();
      
      // 2. Prepara transazione
      setSwapStatus("Preparazione transazione...");
      const tx = {
        to: quoteData.tx.to,
        data: quoteData.tx.data,
        value: quoteData.tx.value,
        gasLimit: 500000,
      };

      // 3. Invia transazione
      setSwapStatus("Invio transazione...");
      const transaction = await signer.sendTransaction(tx);
      
      // 4. Attendi conferma
      setSwapStatus("Attesa conferma...");
      await transaction.wait();
      
      setSwapStatus("Swap completato con successo!");
      setError('');
      
    } catch (err) {
      console.error("Errore swap:", err);
      setError(`Swap fallito: ${err.message || "Errore sconosciuto"}`);
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
              disabled={swapStatus.startsWith("Preparazione")}
            >
              {swapStatus || "Scambia"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;