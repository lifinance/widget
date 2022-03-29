import { useCallback, useEffect, useState } from 'react';
import { Signer } from 'ethers';

import { usePriorityConnector, usePriorityProvider } from './connectorHooks';
import { Wallet } from './wallets';

export const useLifiWalletManagement = () => {
  const priorityConnector = usePriorityConnector();
  const priorityProvider = usePriorityProvider();
  const [signer, setSigner] = useState<Signer>();

  const connect = useCallback(
    async (wallet?: Wallet) => {
      if (!wallet) {
        await priorityConnector.activate();
      } else {
        await wallet.connector.activate();
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

  return {
    connect,
    disconnect,
    signer,
  };
};
