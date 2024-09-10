import { ChainType } from '@lifi/sdk';
import type { CreateConnectorFnExtended } from '@lifi/wallet-management';
import {
  createCoinbaseConnector,
  createMetaMaskConnector,
  createWalletConnectConnector,
  getWalletPriority,
  isWalletInstalled,
  useConfig as useBigmiConfig,
} from '@lifi/wallet-management';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import type { Wallet } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import type { Connector } from 'wagmi';
import { useAccount, useConnect } from 'wagmi';
import { defaultCoinbaseConfig } from '../config/coinbase.js';
import { defaultMetaMaskConfig } from '../config/metaMask.js';
import { defaultWalletConnectConfig } from '../config/walletConnect.js';
import type { WidgetChains, WidgetWalletConfig } from '../types/widget.js';
import { isItemAllowed } from '../utils/item.js';

export const useWallets = (
  walletConfig?: WidgetWalletConfig,
  chains?: WidgetChains,
) => {
  const bigmiConfig = useBigmiConfig();
  const wagmiAccount = useAccount();
  const bigmiAccount = useAccount({ config: bigmiConfig });
  const { connectors: wagmiConnectors } = useConnect();
  const { connectors: bigmiConnectors } = useConnect({ config: bigmiConfig });
  const { wallets: solanaWallets } = useWallet();

  const isDesktopView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm'),
  );

  const wallets = useMemo(() => {
    const evmConnectors: (CreateConnectorFnExtended | Connector)[] =
      Array.from(wagmiConnectors);
    if (
      !wagmiConnectors.some((connector) =>
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
      !wagmiConnectors.some((connector) =>
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
      !wagmiConnectors.some((connector) =>
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
    const utxoInstalled = isItemAllowed(ChainType.UTXO, chains?.types)
      ? bigmiConnectors.filter(
          (connector) =>
            isWalletInstalled(connector.id) &&
            // We should not show already connected connectors
            bigmiAccount.connector?.id !== connector.id,
        )
      : [];
    const utxoNotDetected = isItemAllowed(ChainType.UTXO, chains?.types)
      ? bigmiConnectors.filter((connector) => !isWalletInstalled(connector.id!))
      : [];
    const evmInstalled = isItemAllowed(ChainType.EVM, chains?.types)
      ? evmConnectors.filter(
          (connector) =>
            isWalletInstalled(connector.id) &&
            // We should not show already connected connectors
            wagmiAccount.connector?.id !== connector.id,
        )
      : [];
    const evmNotDetected = isItemAllowed(ChainType.EVM, chains?.types)
      ? evmConnectors.filter((connector) => !isWalletInstalled(connector.id))
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

    const installedWallets = [
      ...evmInstalled,
      ...svmInstalled,
      ...utxoInstalled,
    ].sort(walletComparator);

    if (isDesktopView) {
      const notDetectedWallets = [
        ...evmNotDetected,
        ...svmNotDetected,
        ...utxoNotDetected,
      ].sort(walletComparator);
      installedWallets.push(...notDetectedWallets);
    }

    return installedWallets;
  }, [
    wagmiConnectors,
    chains?.types,
    bigmiConnectors,
    solanaWallets,
    isDesktopView,
    walletConfig?.walletConnect,
    walletConfig?.coinbase,
    walletConfig?.metaMask,
    bigmiAccount.connector?.id,
    wagmiAccount.connector?.id,
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
