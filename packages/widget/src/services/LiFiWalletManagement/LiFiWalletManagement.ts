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

    // const test = async () => {
    //   console.log(await priorityProvider?.getNetwork());
    // };
    // test();
  }, [priorityProvider]);

  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const { ethereum } = window as any; // TODO: Fix typing
  //   if (ethereum && ethereum.on && !active) {
  //     const handleConnect = async () => {
  //       console.log("Handling 'connect' event");
  //       priorityConnector.activate();
  //     };
  //     const handleChainChanged = async (chainId: string | number) => {
  //       console.log("Handling 'chainChanged' event with payload", chainId);
  //       priorityConnector.activate();
  //     };
  //     const handleAccountsChanged = async (accounts: string[]) => {
  //       console.log("Handling 'accountsChanged' event with payload", accounts);
  //       if (accounts.length > 0) {
  //         priorityConnector.activate();
  //       }
  //     };
  //     const handleNetworkChanged = async (networkId: string | number) => {
  //       console.log("Handling 'networkChanged' event with payload", networkId);
  //       priorityConnector.activate();
  //     };

  //     ethereum.on('connect', handleConnect);
  //     ethereum.on('chainChanged', handleChainChanged);
  //     ethereum.on('accountsChanged', handleAccountsChanged);
  //     ethereum.on('networkChanged', handleNetworkChanged);

  //     return () => {
  //       if (ethereum.removeListener) {
  //         ethereum.removeListener('connect', handleConnect);
  //         ethereum.removeListener('chainChanged', handleChainChanged);
  //         ethereum.removeListener('accountsChanged', handleAccountsChanged);
  //         ethereum.removeListener('networkChanged', handleNetworkChanged);
  //       }
  //     };
  //   }
  // });

  return {
    connect,
    disconnect,
    signer,
  };
};
