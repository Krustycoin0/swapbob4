import React from 'react';

const WalletConnect = ({ account, connectWallet }) => {
  return (
    <div className="wallet-connect">
      {account ? (
        <div className="connected-wallet">
          <span className="wallet-address">
            {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
          </span>
        </div>
      ) : (
        <button className="connect-button" onClick={connectWallet}>
          Connetti Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;