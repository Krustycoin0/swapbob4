import { useState } from 'react'

export default function SwapInterface({ lifi, address, chainId }) {
  const [fromToken] = useState({
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
    chainId: chainId
  })
  
  const [toToken] = useState({
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC su Polygon
    chainId: 137
  })
  
  const [amount, setAmount] = useState('0.01')
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRoutes = async () => {
    try {
      setLoading(true)
      setError('')
      
      const result = await lifi.getRoutes({
        fromChainId: fromToken.chainId,
        fromTokenAddress: fromToken.address,
        toChainId: toToken.chainId,
        toTokenAddress: toToken.address,
        fromAmount: amount,
        fromAddress: address,
      })
      
      setRoutes(result.routes)
    } catch (err) {
      console.error('Error fetching routes:', err)
      setError('Impossibile trovare rotte. Verifica la connessione e i parametri.')
    } finally {
      setLoading(false)
    }
  }

  const executeSwap = async (route) => {
    try {
      setLoading(true)
      setError('')
      
      const result = await lifi.executeRoute(route)
      console.log('Swap result:', result)
      
      if (result.transactionHash) {
        alert(`Swap completato! TX: ${result.transactionHash}`)
      }
    } catch (err) {
      console.error('Swap execution failed:', err)
      setError(`Errore swap: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <label className="block mb-2">Importo:</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="0.0"
        />
      </div>
      
      <button
        onClick={fetchRoutes}
        disabled={loading}
        className={`w-full py-3 rounded-lg mb-4 ${
          loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Ricerca rotte...' : 'Trova rotte di swap'}
      </button>
      
      {error && <div className="text-red-400 mb-4">{error}</div>}
      
      <div className="space-y-3">
        {routes.slice(0, 3).map((route, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Rotta #{index + 1}</span>
              <span className="font-bold">
                {route.estimate.toAmountUSD} USD
              </span>
            </div>
            
            <button
              onClick={() => executeSwap(route)}
              disabled={loading}
              className={`w-full py-2 rounded ${
                loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Esegui Swap
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}