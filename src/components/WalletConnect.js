import { ethers } from 'ethers';

class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.userAddress = null;
  }

  // Connessione al wallet
  async connectWallet() {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask non trovato. Installa MetaMask per continuare.');
      }

      // Richiedi accesso agli account
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Inizializza provider e signer
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.userAddress = accounts[0];

      // Ottieni chain ID
      const network = await this.provider.getNetwork();
      
      return {
        success: true,
        address: this.userAddress,
        chainId: network.chainId,
        network: network.name
      };

    } catch (error) {
      console.error('Errore connessione wallet:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verifica se il wallet è già connesso
  async checkConnection() {
    try {
      if (typeof window.ethereum === 'undefined') return false;
      
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      if (accounts.length > 0) {
        this.userAddress = accounts[0];
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Errore verifica connessione:', error);
      return false;
    }
  }

  // Approva token spending
  async approveToken(tokenAddress, spenderAddress, amount) {
    try {
      if (!this.signer) {
        throw new Error('Wallet non connesso');
      }

      // ABI minimale per approve
      const erc20ABI = [
        "function approve(address spender, uint256 amount) returns (bool)"
      ];

      const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, this.signer);
      
      // Esegui approve
      const tx = await tokenContract.approve(spenderAddress, amount);
      
      console.log('Approve transaction hash:', tx.hash);
      
      // Attendi conferma
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        receipt: receipt
      };

    } catch (error) {
      console.error('Errore approve:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Swap tokens
  async swapTokens(routerAddress, swapData, value = '0') {
    try {
      if (!this.signer) {
        throw new Error('Wallet non connesso');
      }

      // ABI per swap (Uniswap V2 style)
      const routerABI = [
        "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
        "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable external returns (uint[] memory amounts)",
        "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
      ];

      const routerContract = new ethers.Contract(routerAddress, routerABI, this.signer);
      
      // Configura la transazione
      const tx = await routerContract.swapExactTokensForTokens(
        swapData.amountIn,
        swapData.amountOutMin,
        swapData.path,
        swapData.to,
        swapData.deadline,
        {
          value: value, // ETH value se necessario
          gasLimit: 300000, // Gas limit stimato
          // gasPrice: await this.provider.getGasPrice() // Opzionale
        }
      );
      
      console.log('Swap transaction hash:', tx.hash);
      
      // Attendi conferma
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        receipt: receipt
      };

    } catch (error) {
      console.error('Errore swap:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get token balance
  async getTokenBalance(tokenAddress, userAddress = this.userAddress) {
    try {
      const erc20ABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ];

      const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, this.provider);
      const balance = await tokenContract.balanceOf(userAddress);
      const decimals = await tokenContract.decimals();
      
      return ethers.utils.formatUnits(balance, decimals);

    } catch (error) {
      console.error('Errore get balance:', error);
      return '0';
    }
  }

  // Get ETH balance
  async getEthBalance() {
    try {
      if (!this.provider || !this.userAddress) return '0';
      
      const balance = await this.provider.getBalance(this.userAddress);
      return ethers.utils.formatEther(balance);

    } catch (error) {
      console.error('Errore get ETH balance:', error);
      return '0';
    }
  }
}

// Esporta un'istanza singleton
export const walletService = new WalletService();
