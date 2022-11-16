import type { Signer } from '@ethersproject/abstract-signer';
import type { ExternalProvider } from '@ethersproject/providers';
import { Web3Provider } from '@ethersproject/providers';
import type { Connector } from '@web3-react/types';
import { useCallback, useEffect, useState } from 'react';
import { usePriorityConnector } from './priorityConnector';
// import { usePriorityConnector, usePriorityProvider } from './connectorHooks';
import { getInjectedAddress } from './injectedData';
import {
  addToActiveWallets,
  addToDeactivatedWallets,
  isWalletDeactivated,
  removeFromActiveWallets,
  removeFromDeactivatedWallets,
} from './walletPersistance';
import type { Wallet } from './walletProviders';

export const useLiFiWalletManagement = () => {
  const priorityConnector = usePriorityConnector();
  // "any" because of https://github.com/ethers-io/ethers.js/issues/866
  // const priorityProvider = usePriorityProvider('any');
  // const [currentProvider, setCurrentProvider] = useState<Web3Provider>();
  const [currentConnector, setCurrentConnector] = useState<Connector>();
  const [signer, setSigner] = useState<Signer>();

  const flushCurrentWalletData = () => {
    setCurrentConnector(undefined);
    // setCurrentProvider(undefined);
    setSigner(undefined);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const calcWalletData = (connector?: Connector) => {
    if (connector) {
      const provider = new Web3Provider(
        (connector.provider as ExternalProvider) || (window as any).ethereum,
        'any', // fallback
      );
      // setCurrentProvider(() => provider);
      setCurrentConnector(() => connector);
      setSigner(() => provider?.getSigner?.());
    }
  };

  const connect = useCallback(
    async (wallet?: Wallet) => {
      try {
        if (wallet) {
          const { connector } = wallet.web3react;
          await connector.activate();
          calcWalletData(connector);
        } else {
          await priorityConnector.activate();
        }
      } catch (e) {
        console.log(e);
      }
      const selectedAddress = getInjectedAddress(wallet);
      removeFromDeactivatedWallets(selectedAddress);
      addToActiveWallets(selectedAddress);
    },
    [calcWalletData, priorityConnector],
  );

  const disconnect = useCallback(
    async (wallet?: Wallet) => {
      const selectedAddress = getInjectedAddress(wallet);
      removeFromActiveWallets(selectedAddress);
      addToDeactivatedWallets(selectedAddress);
      if (wallet) {
        await currentConnector?.deactivate?.();
        flushCurrentWalletData();
      } else if (priorityConnector.deactivate) {
        await priorityConnector.deactivate?.();
        flushCurrentWalletData();
      } else {
        await priorityConnector.resetState();
        flushCurrentWalletData();
      }
    },
    [priorityConnector, currentConnector],
  );

  // eager connect
  useEffect(() => {
    const selectedAddress = getInjectedAddress();
    if (!isWalletDeactivated(selectedAddress) && priorityConnector) {
      priorityConnector.connectEagerly?.();
      calcWalletData(priorityConnector);
    }
  }, [
    priorityConnector,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (window as any).ethereum?.selectedAddress,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (window as any).tally?.selectedAddress,
  ]);

  // injected wallet listeners
  useEffect(() => {
    const { ethereum } = window as any;
    const handleChainChanged = async (chainId: string | number) => {
      await currentConnector?.activate();
      calcWalletData(currentConnector);
    };
    const handleAccountsChanged = async (accounts: string[]) => {
      if (!accounts.length) {
        await currentConnector?.deactivate?.();
        flushCurrentWalletData();
      }
    };

    ethereum?.on('chainChanged', handleChainChanged);
    ethereum?.on('accountsChanged', handleAccountsChanged);

    return () => {
      if (ethereum?.removeListener) {
        ethereum.removeListener('chainChanged', handleChainChanged);
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [currentConnector]);

  return {
    connect,
    disconnect,
    signer,
    provider: signer?.provider,
  };
};
