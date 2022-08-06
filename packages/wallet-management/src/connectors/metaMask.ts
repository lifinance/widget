import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';

export const [metaMask, hooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions }),
);

/*
Known issues:
issue: metamask uninitialized
https://github.com/MetaMask/metamask-extension/issues/9407
https://github.com/MetaMask/metamask-extension/issues/13465

issue: unexpected updating of eth_accounts
Issue stems from web3React. Issue does not impact performance or functionality
*/
