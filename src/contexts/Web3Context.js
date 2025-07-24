import { createContext, useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import LiFi from '@lifi/sdk';
import { walletConnectProvider, injected } from '../connectors';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const { activate, deactivate, active, account, library, chainId } = useWeb3React();
  const [lifi, setLifi] = useState(null);
  const [provider, setProvider] = useState(null);

  // Inizializza LiFi con la tua API key
  useEffect(() => {
    const lifiInstance = new LiFi({
      apiKey: '37f3b0ae-58d0-423a-a895-133cd60f2b72.20bd41f0-014e-4389-9dfa-9eaefb8589e5'
    });
    setLifi(lifiInstance);
  }, []);

  // Configura provider con RPC pubblici
  useEffect(() => {
    if (chainId) {
      const publicProvider = new ethers.providers.JsonRpcProvider(
        PUBLIC_RPCS[chainId]
      );
      setProvider(publicProvider);
    }
  }, [chainId]);

  // Connessione automatica
  useEffect(() => {
    const tryAutoConnect = async () => {
      const isConnected = localStorage.getItem('walletConnected');
      if (isConnected && await injected.isAuthorized()) {
        activate(injected);
      }
    };
    tryAutoConnect();
  }, [activate]);

  const connect = async (connectorType) => {
    try {
      if (connectorType === 'metamask') {
        await activate(injected);
        localStorage.setItem('walletConnected', 'metamask');
      } else if (connectorType === 'walletconnect') {
        await activate(walletConnectProvider);
      }
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const disconnect = () => {
    deactivate();
    localStorage.removeItem('walletConnected');
    if (walletConnectProvider.connected) {
      walletConnectProvider.disconnect();
    }
  };

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        provider,
        account,
        active,
        chainId,
        lifi
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);

// Endpoint RPC pubblici
const PUBLIC_RPCS = {
  1: 'https://cloudflare-eth.com', // Ethereum
  56: 'https://bsc-dataseed.binance.org/', // BSC
  137: 'https://polygon-rpc.com/', // Polygon
  42161: 'https://arb1.arbitrum.io/rpc' // Arbitrum
};