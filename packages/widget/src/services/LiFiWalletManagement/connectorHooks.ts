import { getPriorityConnector } from '@web3-react/core';
import { eip1193, hooks as eip1193Hooks } from './connectors/eip1193';
import { hooks as metaMaskHooks, metaMask } from './connectors/metaMask';
import {
  hooks as walletConnectHooks,
  walletConnect,
} from './connectors/walletConnect';

export const {
  useSelectedChainId,
  useSelectedAccounts,
  useSelectedIsActivating,
  useSelectedError,
  useSelectedAccount,
  useSelectedIsActive,
  useSelectedProvider,
  useSelectedENSNames,
  useSelectedENSName,
  useSelectedWeb3React,
  usePriorityConnector,
  usePriorityChainId,
  usePriorityAccounts,
  usePriorityIsActivating,
  usePriorityError,
  usePriorityAccount,
  usePriorityIsActive,
  usePriorityProvider,
  usePriorityENSNames,
  usePriorityENSName,
  usePriorityWeb3React,
} = getPriorityConnector(
  [eip1193, eip1193Hooks],
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  // [walletLink, walletLinkHooks],
  // [network, networkHooks],
);
