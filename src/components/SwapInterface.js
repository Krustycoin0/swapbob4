import React, { useState } from 'react';
import { ethers } from 'ethers';

const SwapInterface = ({ account, provider, lifi, chainId }) => {
  const [amount, setAmount] = useState('0.01');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  // Token predefiniti
  const fromToken = {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
    chainId: chainId
  };

  const toToken = {
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC su Polygon
    chainId: 137
  };

  // Trova rotte di swap
  const findSwapRoutes = async () => {
    if (!lifi || !provider) return;
    
    try {
      setLoading(true);
      setError('');
      setStatus('Ricerca rotte...');
      
      const result = await lifi.getRoutes({
        fromChainId: fromToken.chainId,
        fromTokenAddress: fromToken.address,
        toChainId: toToken.chainId,
        toTokenAddress: toToken.address,
        fromAmount: ethers.utils.parseEther(amount).toString(),
        fromAddress: account,
      });
      
      setRoutes(result.routes || []);
      setStatus(result.routes.length > 0 
        ? `Trovate ${result.routes.length} rotte` 
        : 'Nessuna rotta disponibile');
      
    } catch (err) {
      console.error('Errore ricerca rotte:', err);
      setError('Impossibile trovare rotte. Verifica i parametri.');
      setStatus('Errore nella ricerca');
    } finally {
      setLoading(false);
    }
  };

  // Esegui lo swap
  const executeSwap = async (route) => {
    if (!provider || !lifi) return;
    
    try {
      setLoading(true);
      setError('');
      setStatus('Preparazione transazione...');
      
      const signer = provider.getSigner();
      setStatus('Firma della transazione in corso...');
      
      const result = await lifi.executeRoute(signer, route);
      
      if (result.transactionHash) {
        setStatus(`Transazione inviata! Hash: ${result.transactionHash}`);
        // Mostra link all'esploratore
        const explorerLink = `https://etherscan.io/tx/${result.transactionHash}`;
        setStatus(
          <span>
            Transazione completata!{' '}
            <a href={explorerLink} target="_blank" rel="noopener noreferrer">
              Visualizza su Etherscan
            </a>
          </span>
        );
      }
      
    } catch (err) {
      console.error('Errore swap:', err);
      setError(`Errore nell'esecuzione: ${err.message}`);
      setStatus('Swap fallito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="swap-interface">
      <div className="swap-input">
        <label>Importo da scambiare (ETH):</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <div className="swap-actions">
        <button 
          onClick={findSwapRoutes} 
          disabled={loading || !account}
        >
          {loading ? 'Ricerca in corso...' : 'Trova rotte'}
        </button>
      </div>
      
      {status && <div className="status-message">{status}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="swap-routes">
        {routes.slice(0, 3).map((route, index) => (
          <div key={index} className="route-card">
            <h3>Rotta #{index + 1}</h3>
            <p>
              <strong>Riceverai:</strong> {ethers.utils.formatUnits(route.estimate.toAmount, 6)} USDC
            </p>
            <p>
              <strong>Costo gas:</strong> ${route.estimate.gasCostUSD.toFixed(2)}
            </p>
            <p>
              <strong>Durata stimata:</strong> {route.estimate.estimatedDuration / 60} minuti
            </p>
            
            <button 
              onClick={() => executeSwap(route)} 
              disabled={loading}
            >
              Esegui Swap
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwapInterface;