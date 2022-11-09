import type { Signer } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { usePriorityConnector, usePriorityProvider } from './connectorHooks';
import {
  addToActiveWallets,
  addToDeactivatedWallets,
  isWalletDeactivated,
  removeFromActiveWallets,
  removeFromDeactivatedWallets,
} from './walletPersistance';
import type { Wallet } from './wallets';

export const useLiFiWalletManagement = () => {
  const priorityConnector = usePriorityConnector();
  // "any" because of https://github.com/ethers-io/ethers.js/issues/866
  const priorityProvider = usePriorityProvider('any');
  const [signer, setSigner] = useState<Signer>();

  const connect = useCallback(
    async (wallet?: Wallet) => {
      const selectedAddress = (window as any)?.ethereum?.selectedAddress;
      try {
        if (wallet) {
          await wallet.connector.activate();
        } else {
          await priorityConnector.activate();
        }
      } catch (e) {
        console.log(e);
      }
      removeFromDeactivatedWallets(selectedAddress);
      addToActiveWallets(selectedAddress);
    },
    [priorityConnector],
  );

  const disconnect = useCallback(
    async (wallet?: Wallet) => {
      const selectedAddress = (window as any).ethereum?.selectedAddress;
      removeFromActiveWallets(selectedAddress);
      addToDeactivatedWallets(selectedAddress);
      if (wallet) {
        await wallet.connector.deactivate?.();
      } else if (priorityConnector.deactivate) {
        await priorityConnector.deactivate?.();
      } else {
        await priorityConnector.resetState();
        setSigner(undefined);
      }
    },
    [priorityConnector],
  );

  useEffect(() => {
    setSigner(priorityProvider?.getSigner());
  }, [priorityProvider]);

  useEffect(() => {
    const selectedAddress = (window as any).ethereum?.selectedAddress;
    if (!isWalletDeactivated(selectedAddress)) {
      priorityConnector?.connectEagerly!();
    }
  }, [priorityConnector?.connectEagerly]);

  useEffect(() => {
    const { ethereum } = window as any;

    const handleChainChanged = async (chainId: string | number) => {
      await priorityConnector.activate();
    };

    ethereum?.on('chainChanged', handleChainChanged);

    return () => {
      if (ethereum?.removeListener) {
        ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [priorityConnector]);

  return {
    connect,
    disconnect,
    signer,
    provider: priorityProvider,
  };
};
