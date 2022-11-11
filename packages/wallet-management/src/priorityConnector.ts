import { getPriorityConnector } from '@web3-react/core';
import { supportedWallets } from './walletProviders';
// import { eip1193, hooks as eip1193Hooks } from './connectors/eip1193';

const metamaskWallet = supportedWallets.find(
  (wallet) => wallet.name === 'MetaMask',
);
export const {
  useSelectedStore,
  useSelectedChainId,
  useSelectedAccounts,
  useSelectedIsActivating,
  useSelectedAccount,
  useSelectedIsActive,
  useSelectedProvider,
  useSelectedENSNames,
  useSelectedENSName,
  usePriorityConnector,
  usePriorityStore,
  usePriorityChainId,
  usePriorityAccounts,
  usePriorityIsActivating,
  usePriorityAccount,
  usePriorityIsActive,
  usePriorityProvider,
  usePriorityENSNames,
  usePriorityENSName,
} = getPriorityConnector(
  [metamaskWallet!.web3react.connector, metamaskWallet!.web3react.hooks], // needs to be on top!
  // [eip1193, eip1193Hooks],
  // [walletConnect, walletConnectHooks],
  // [walletLink, walletLinkHooks],
  // [network, networkHooks],
);
