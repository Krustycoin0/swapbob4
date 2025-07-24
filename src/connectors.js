import { InjectedConnector } from '@web3-react/injected-connector';
import WalletConnect from '@walletconnect/web3-provider';

// Endpoint RPC pubblici gratuiti
const PUBLIC_RPCS = {
  1: 'https://cloudflare-eth.com', // Ethereum
  56: 'https://bsc-dataseed.binance.org/', // BSC
  137: 'https://polygon-rpc.com/', // Polygon
  42161: 'https://arb1.arbitrum.io/rpc' // Arbitrum
};

export const walletConnectProvider = new WalletConnect({
  rpc: PUBLIC_RPCS,
  qrcodeModalOptions: {
    mobileLinks: ['metamask', 'trust', 'safepal', 'coinbase']
  }
});

export const injected = new InjectedConnector({
  supportedChainIds: Object.keys(PUBLIC_RPCS).map(Number)
});