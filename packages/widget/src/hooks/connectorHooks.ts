import { getPriorityConnector } from '@web3-react/core';
import {
  hooks as metaMaskHooks,
  metaMask,
} from '../services/LiFiWalletManagement/connectors/metaMask';
import {
  hooks as walletConnectHooks,
  walletConnect,
} from '../services/LiFiWalletManagement/connectors/walletConnect';

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
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  // [walletLink, walletLinkHooks],
  // [network, networkHooks],
);
