import { useWeb3 } from '../contexts/Web3Context';

export const useSwap = () => {
  const { lifi, provider, account } = useWeb3();

  const getRoutes = async (fromToken, toToken, amount) => {
    try {
      const routes = await lifi.getRoutes({
        fromChainId: fromToken.chainId,
        fromTokenAddress: fromToken.address,
        toChainId: toToken.chainId,
        toTokenAddress: toToken.address,
        fromAmount: amount,
        fromAddress: account,
      });
      return routes;
    } catch (error) {
      console.error('Error fetching routes:', error);
      return [];
    }
  };

  const executeSwap = async (route) => {
    try {
      const signer = provider.getSigner();
      const result = await lifi.executeRoute(signer, route);
      return result;
    } catch (error) {
      console.error('Swap execution failed:', error);
      return { error: error.message };
    }
  };

  return { getRoutes, executeSwap };
};