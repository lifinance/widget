import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';

export const [metaMask, hooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask(actions, true), // eagerConnect is set to true TODO: only true when config useLiFiManagement config true
);
