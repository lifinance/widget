import { supportedChains } from '@lifi/sdk';
import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect';

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      rpc: Object.fromEntries(
        supportedChains.map((chain) => {
          return [chain.id, chain.metamask.rpcUrls[0] || ''];
        }),
      ),
    }),
);
