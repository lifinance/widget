import { useCallback, useEffect, useState } from 'react';
import { Signer } from 'ethers';

import { usePriorityConnector, usePriorityProvider } from './connectorHooks';
import { metaMask } from './connectors/metaMask';
import { walletConnect } from './connectors/walletConnect';
import metamaskIcon from './walletIcons/metaMask.svg';
import walletConnectIcon from './walletIcons/walletConnect.svg';

export enum SupportedWalletProviders {
  MetaMask,
  WalletConnect,
}

export const supportedWalletInfos: {
  [key in SupportedWalletProviders]: {
    name: string;
    icon: string;
  };
} = {
  [SupportedWalletProviders.MetaMask]: {
    name: 'MetaMask',
    icon: metamaskIcon,
  },
  [SupportedWalletProviders.WalletConnect]: {
    name: 'WalletConnect',
    icon: walletConnectIcon,
  },
};
export const useLifiWalletManagement = () => {
  const priorityConnector = usePriorityConnector();
  const priorityProvider = usePriorityProvider();
  const [signer, setSigner] = useState<Signer>();

  const connect = useCallback(
    async (walletProvider?: SupportedWalletProviders) => {
      switch (walletProvider) {
        case SupportedWalletProviders.MetaMask:
          await metaMask.activate();
          break;
        case SupportedWalletProviders.WalletConnect:
          await walletConnect.activate();
          break;
        default:
          await priorityConnector.activate();
      }
    },
    [priorityConnector],
  );

  const disconnect = useCallback(async () => {
    await priorityConnector.deactivate();
  }, [priorityConnector]);

  useEffect(() => {
    setSigner(priorityProvider?.getSigner());
  }, [priorityProvider]);

  return {
    connect,
    disconnect,
    signer,
  };
};
