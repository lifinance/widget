import { getPriorityConnector } from '@web3-react/core';
import { eip1193, hooks as eip1193Hooks } from './connectors/eip1193';
import { hooks as metaMaskHooks, metaMask } from './connectors/metaMask';
import {
  hooks as walletConnectHooks,
  walletConnect,
} from './connectors/walletConnect';

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
  [metaMask, metaMaskHooks], // needs to be on top!
  [eip1193, eip1193Hooks],
  [walletConnect, walletConnectHooks],
  // [walletLink, walletLinkHooks],
  // [network, networkHooks],
);
