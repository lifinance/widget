import { getPriorityConnector, Web3ReactHooks } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import { supportedWallets } from './walletProviders';
// import { eip1193, hooks as eip1193Hooks } from './connectors/eip1193';

// const metamaskWallet = supportedWallets.find(
//   (wallet) => wallet.name === 'MetaMask',
// );
const connectorHookList: [Connector, Web3ReactHooks][] = supportedWallets.map(
  (wallet) => [wallet.web3react.connector, wallet.web3react.hooks],
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
} = getPriorityConnector(...connectorHookList);
