import React, { useState } from 'react';
import { useSwap } from '../services/swapService';

const SwapInterface = () => {
  const [fromToken, setFromToken] = useState({ chainId: 1, address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' });
  const [toToken, setToToken] = useState({ chainId: 137, address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619' });
  const [amount, setAmount] = useState('0.01');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getRoutes, executeSwap } = useSwap();

  const fetchRoutes = async () => {
    setLoading(true);
    const foundRoutes = await getRoutes(fromToken, toToken, amount);
    setRoutes(foundRoutes.routes || []);
    setLoading(false);
  };

  const handleSwap = async (route) => {
    setLoading(true);
    const result = await executeSwap(route);
    if (result) {
      alert(`Swap completato! Hash: ${result.transactionHash}`);
    }
    setLoading(false);
  };

  return (
    <div className="swap-container">
      <div className="input-group">
        <label>Da:</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Importo"
        />
      </div>

      <button onClick={fetchRoutes} disabled={loading}>
        {loading ? 'Ricerca rotte...' : 'Trova rotte'}
      </button>

      <div className="routes-list">
        {routes.map((route, index) => (
          <div key={index} className="route-card">
            <h4>Rotta #{index + 1}</h4>
            <p>Prezzo stimato: {route.estimate.toAmount} {toToken.symbol}</p>
            <p>Costi gas: ${route.estimate.gasCostsUSD.toFixed(2)}</p>
            <button onClick={() => handleSwap(route)} disabled={loading}>
              Esegui Swap
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwapInterface;