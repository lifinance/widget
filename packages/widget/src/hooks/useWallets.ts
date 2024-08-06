import { ChainType } from '@lifi/sdk';
import type { CreateConnectorFnExtended } from '@lifi/wallet-management';
import {
  createCoinbaseConnector,
  createMetaMaskConnector,
  createWalletConnectConnector,
  getWalletPriority,
  isWalletInstalled,
} from '@lifi/wallet-management';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import type { Wallet } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import type { Connector } from 'wagmi';
import { useConnect, useAccount as useWagmiAccount } from 'wagmi';
import { defaultCoinbaseConfig } from '../config/coinbase.js';
import { defaultMetaMaskConfig } from '../config/metaMask.js';
import { defaultWalletConnectConfig } from '../config/walletConnect.js';
import type { WidgetChains, WidgetWalletConfig } from '../types/widget.js';
import { isItemAllowed } from '../utils/item.js';

export const useWallets = (
  walletConfig?: WidgetWalletConfig,
  chains?: WidgetChains,
) => {
  const account = useWagmiAccount();
  const { connectors } = useConnect();
  const { wallets: solanaWallets } = useWallet();

  const isDesktopView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm'),
  );

  const wallets = useMemo(() => {
    const evmConnectors: (CreateConnectorFnExtended | Connector)[] =
      Array.from(connectors);
    if (
      !connectors.some((connector) =>
        connector.id.toLowerCase().includes('walletconnect'),
      )
    ) {
      evmConnectors.unshift(
        createWalletConnectConnector(
          walletConfig?.walletConnect ?? defaultWalletConnectConfig,
        ),
      );
    }
    if (
      !connectors.some((connector) =>
        connector.id.toLowerCase().includes('coinbase'),
      ) &&
      !isWalletInstalled('coinbase')
    ) {
      evmConnectors.unshift(
        createCoinbaseConnector(
          walletConfig?.coinbase ?? defaultCoinbaseConfig,
        ),
      );
    }
    if (
      !connectors.some((connector) =>
        connector.id.toLowerCase().includes('metamask'),
      ) &&
      !isWalletInstalled('metaMask')
    ) {
      evmConnectors.unshift(
        createMetaMaskConnector(
          walletConfig?.metaMask ?? defaultMetaMaskConfig,
        ),
      );
    }
    const evmInstalled = isItemAllowed(ChainType.EVM, chains?.types)
      ? evmConnectors.filter(
          (connector) =>
            isWalletInstalled(connector.id!) &&
            // We should not show already connected connectors
            account.connector?.id !== connector.id,
        )
      : [];
    const evmNotDetected = isItemAllowed(ChainType.EVM, chains?.types)
      ? evmConnectors.filter((connector) => !isWalletInstalled(connector.id!))
      : [];
    const svmInstalled = isItemAllowed(ChainType.SVM, chains?.types)
      ? solanaWallets?.filter(
          (connector) =>
            connector.adapter.readyState === WalletReadyState.Installed &&
            // We should not show already connected connectors
            !connector.adapter.connected,
        )
      : [];
    const svmNotDetected = isItemAllowed(ChainType.SVM, chains?.types)
      ? solanaWallets?.filter(
          (connector) =>
            connector.adapter.readyState !== WalletReadyState.Installed,
        )
      : [];

    const installedWallets = [...evmInstalled, ...svmInstalled].sort(
      walletComparator,
    );

    if (isDesktopView) {
      const notDetectedWallets = [...evmNotDetected, ...svmNotDetected].sort(
        walletComparator,
      );
      installedWallets.push(...notDetectedWallets);
    }

    return installedWallets;
  }, [
    account.connector?.id,
    chains?.types,
    connectors,
    isDesktopView,
    solanaWallets,
    walletConfig?.coinbase,
    walletConfig?.metaMask,
    walletConfig?.walletConnect,
  ]);

  return wallets;
};

export const walletComparator = (
  a: CreateConnectorFnExtended | Connector | Wallet,
  b: CreateConnectorFnExtended | Connector | Wallet,
) => {
  let aId = (a as Connector).id || (a as Wallet).adapter?.name;
  let bId = (b as Connector).id || (b as Wallet).adapter?.name;

  const priorityA = getWalletPriority(aId);
  const priorityB = getWalletPriority(bId);

  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  if (aId < bId) {
    return -1;
  }
  if (aId > bId) {
    return 1;
  }
  return 0;
};
