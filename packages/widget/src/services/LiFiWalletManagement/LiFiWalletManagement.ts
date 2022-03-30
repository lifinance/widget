import { useCallback, useEffect, useState } from 'react';
import { Signer } from 'ethers';

import { usePriorityConnector, usePriorityProvider } from './connectorHooks';
import { Wallet } from './wallets';
import {
  addToActiveWallets,
  addToDeactivatedWallets,
  isWalletDeactivated,
  removeFromActiveWallets,
  removeFromDeactivatedWallets,
} from './walletPersistance';

export const useLifiWalletManagement = () => {
  const priorityConnector = usePriorityConnector();
  const priorityProvider = usePriorityProvider();
  const [signer, setSigner] = useState<Signer>();

  const connect = useCallback(
    async (wallet?: Wallet) => {
      const currentlySelectedUserAddress = (window as any).ethereum
        .selectedAddress;
      try {
        if (!wallet) {
          await priorityConnector.activate();
        } else {
          await wallet.connector.activate();
        }
      } catch (e) {
        console.log(e);
      }
      removeFromDeactivatedWallets(currentlySelectedUserAddress);
      addToActiveWallets(currentlySelectedUserAddress);
    },
    [priorityConnector],
  );

  const disconnect = useCallback(
    async (wallet?: Wallet) => {
      const currentlySelectedUserAddress = (window as any).ethereum
        .selectedAddress;

      console.log(currentlySelectedUserAddress);

      removeFromActiveWallets(currentlySelectedUserAddress);
      addToDeactivatedWallets(currentlySelectedUserAddress);
      if (!wallet) {
        await priorityConnector.deactivate();
      } else {
        await wallet.connector.deactivate();
      }
    },
    [priorityConnector],
  );

  useEffect(() => {
    setSigner(priorityProvider?.getSigner());
  }, [priorityProvider]);

  useEffect(() => {
    const currentlySelectedUserAddress = (window as any).ethereum
      .selectedAddress;

    if (!isWalletDeactivated(currentlySelectedUserAddress)) {
      console.log('trying to connect eagerly');
      priorityConnector?.connectEagerly!();
    }
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { ethereum } = window as any; // TODO: Fix typing
    if (ethereum && ethereum.on) {
      const handleConnect = async () => {
        console.log("Handling 'connect' event");

        await priorityConnector.activate();
      };
      const handleChainChanged = async (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        await priorityConnector.activate();
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      // ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          // ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);
  return {
    connect,
    disconnect,
    signer,
  };
};
