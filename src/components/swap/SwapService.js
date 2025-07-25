import { walletService } from './wallet.js';
import { ethers } from 'ethers';

class SwapService {
  constructor() {
    // Configura i tuoi router addresses
    this.routerAddresses = {
      // Aggiungi i router del tuo exchange
      mainRouter: "0x...", // Il tuo router address
    };
  }

  // Prepara dati per swap
  prepareSwapData(amountIn, amountOutMin, tokenIn, tokenOut, deadlineMinutes = 20) {
    const path = [tokenIn, tokenOut];
    const to = walletService.userAddress;
    const deadline = Math.floor(Date.now() / 1000) + (deadlineMinutes * 60);

    return {
      amountIn: ethers.utils.parseUnits(amountIn, 18), // Adjust decimals
      amountOutMin: ethers.utils.parseUnits(amountOutMin, 18),
      path: path,
      to: to,
      deadline: deadline
    };
  }

  // Esegui swap completo
  async executeSwap(tokenIn, tokenOut, amountIn, slippage = 0.5) {
    try {
      // 1. Approva il router per spendere i token
      const approveResult = await walletService.approveToken(
        tokenIn,
        this.routerAddresses.mainRouter,
        ethers.constants.MaxUint256 // Approva quantità illimitata
      );

      if (!approveResult.success) {
        throw new Error(`Approve failed: ${approveResult.error}`);
      }

      console.log('Approve confirmed:', approveResult.transactionHash);

      // 2. Calcola amountOutMin con slippage
      const estimatedAmountOut = await this.getEstimatedOutput(
        tokenIn, tokenOut, amountIn
      );
      
      const amountOutMin = estimatedAmountOut * (1 - slippage / 100);

      // 3. Prepara swap data
      const swapData = this.prepareSwapData(
        amountIn,
        amountOutMin.toString(),
        tokenIn,
        tokenOut
      );

      // 4. Esegui swap
      const swapResult = await walletService.swapTokens(
        this.routerAddresses.mainRouter,
        swapData
      );

      return swapResult;

    } catch (error) {
      console.error('Swap execution error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Stima output (implementa secondo il tuo router)
  async getEstimatedOutput(tokenIn, tokenOut, amountIn) {
    // Implementa la logica per ottenere l'output stimato
    // Questo dipende dal tuo router specifico
    return amountIn * 0.997; // Esempio: 0.3% fee
  }
}

export const swapService = new SwapService();
