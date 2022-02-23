import { useCallback, useEffect, useState } from 'react';
import { Signer } from 'ethers';

import {
  usePriorityConnector,
  usePriorityProvider,
} from '../../hooks/connectorHooks';
import { metaMask } from './connectors/metaMask';
import { walletConnect } from './connectors/walletConnect';

export enum SupportedWalletProviders {
  MetaMask,
  WalletConnect,
}
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
