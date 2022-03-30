import { useCallback, useEffect, useState } from 'react';
import { Signer } from 'ethers';

import {
  usePriorityAccount,
  usePriorityConnector,
  usePriorityProvider,
} from './connectorHooks';
import { Wallet } from './wallets';

export const useLifiWalletManagement = () => {
  const priorityConnector = usePriorityConnector();
  const priorityProvider = usePriorityProvider();
  const [signer, setSigner] = useState<Signer>();
  const account = usePriorityAccount();

  const connect = useCallback(
    async (wallet?: Wallet) => {
      try {
        if (!wallet) {
          await priorityConnector.activate();
        } else {
          await wallet.connector.activate();
        }
      } catch {
        console.log('hello');
      }
    },
    [priorityConnector],
  );

  const disconnect = useCallback(
    async (wallet?: Wallet) => {
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

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { ethereum } = window as any; // TODO: Fix typing
    if (ethereum && ethereum.on && !account) {
      const handleConnect = async () => {
        console.log("Handling 'connect' event");
        console.log(priorityConnector);

        await priorityConnector.activate();
      };
      const handleChainChanged = async (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        console.log(priorityConnector);
        await priorityConnector.activate();
      };
      const handleAccountsChanged = async (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          await priorityConnector.activate();
        }
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
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
