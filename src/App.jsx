import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/react'
import { useMemo } from 'react'
import LiFi from '@lifi/sdk'

const LIFI_API_KEY = '37f3b0ae-58d0-423a-a895-133cd60f2b72.20bd41f0-014e-4389-9dfa-9eaefb8589e5'

function App() {
  const { open } = useWeb3Modal()
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  
  const lifi = useMemo(() => new LiFi({
    apiKey: LIFI_API_KEY,
    defaultRouteOptions: {
      integrator: 'SwapBobApp'
    }
  }), [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">SwapBob</h1>
        
        <button
          onClick={() => open()}
          className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg transition"
        >
          {isConnected ? (
            <span>
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </span>
          ) : (
            'Connetti Wallet'
          )}
        </button>
      </header>

      {isConnected && (
        <div className="bg-gray-800 p-6 rounded-xl max-w-md mx-auto">
          <h2 className="text-xl mb-4">Swap Interchain</h2>
          <SwapInterface lifi={lifi} address={address} chainId={chainId} />
        </div>
      )}
    </div>
  )
}

export default App