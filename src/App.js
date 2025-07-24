import React from 'react';
import WalletButton from './components/WalletButton';
import SwapInterface from './components/SwapInterface';
import { useWeb3 } from './contexts/Web3Context';
import './App.css';

function App() {
  const { account } = useWeb3();

  return (
    <div className="App">
      <header>
        <h1>SwapBob</h1>
        <WalletButton />
      </header>

      <main>
        {account ? (
          <SwapInterface />
        ) : (
          <div className="connect-wallet-prompt">
            <p>Connetti il tuo wallet per iniziare a fare swap</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;