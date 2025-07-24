import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Web3Modal } from '@web3modal/react'
import { EthereumClient, w3mProvider } from '@web3modal/ethers'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, polygon, bsc, arbitrum } from 'wagmi/chains'

// 1. Configura le chains
const chains = [mainnet, polygon, bsc, arbitrum]
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID' // Ottieni da https://cloud.walletconnect.com

// 2. Configurazione Wagmi
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [],
  publicClient
})

// 3. Configura Ethereum client
const ethereumClient = new EthereumClient(wagmiConfig, chains)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
    
    <Web3Modal
      projectId={projectId}
      ethereumClient={ethereumClient}
      themeMode="dark"
      themeVariables={{
        '--w3m-accent': '#2563eb',
        '--w3m-border-radius-master': '8px'
      }}
    />
  </React.StrictMode>
)