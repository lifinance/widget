import events from 'events';
import type { Wallet } from './types';
import {
  addToActiveWallets,
  addToDeactivatedWallets,
  // isWalletDeactivated,
  removeFromActiveWallets,
  removeFromDeactivatedWallets,
} from './walletPersistance';

export class LiFiWalletManagement extends events.EventEmitter {
  connectedWallets: Wallet[] = [];

  connect = async (wallet: Wallet) => {
    try {
      await wallet.connect();
      wallet.addListener('walletAccountChanged', this.handleAccountDataChange);
      this.connectedWallets.push(wallet); // TODO: add new wallet as first element
      removeFromDeactivatedWallets(wallet.account?.address);
      addToActiveWallets(wallet.account?.address);
    } catch (e) {
      throw e;
    }
  };

  disconnect = async (wallet: Wallet) => {
    const selectedAddress = wallet.account?.address;
    wallet.removeAllListeners();
    removeFromActiveWallets(selectedAddress);
    addToDeactivatedWallets(selectedAddress);

    wallet.disconnect();
  };

  private handleAccountDataChange() {
    this.emit('walletChanged', this.connectedWallets);
  }
}

// export const useLiFiWalletManagement = () => {
//   // const priorityConnector = usePriorityConnector();
//   // "any" because of https://github.com/ethers-io/ethers.js/issues/866
//   // const priorityProvider = usePriorityProvider('any');
//   // const [currentProvider, setCurrentProvider] = useState<Web3Provider>();
//   const [currentConnector, setCurrentConnector] = useState<Connector>();
//   const [signer, setSigner] = useState<Signer>();

//   const flushCurrentWalletData = () => {
//     setCurrentConnector(undefined);
//     // setCurrentProvider(undefined);
//     setSigner(undefined);
//   };

//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   const calcWalletData = (connector?: Connector) => {
//     if (connector) {
//       const provider = new Web3Provider(
//         (connector.provider as ExternalProvider) || (window as any).ethereum,
//         'any', // fallback
//       );
//       // setCurrentProvider(() => provider);
//       setCurrentConnector(() => connector);
//       setSigner(() => provider?.getSigner?.());
//     }
//   };

//   // const connect = useCallback(
//   //   async (wallet?: Wallet) => {
//   //     try {
//   //       if (wallet) {
//   //         const { connector } = wallet.web3react;
//   //         await connector.activate();
//   //         calcWalletData(connector);
//   //       } else {
//   //         await priorityConnector.activate();
//   //       }
//   //     } catch (e) {
//   //       console.log(e);
//   //     }
//   //     const selectedAddress = getInjectedAddress(wallet);
//   //     removeFromDeactivatedWallets(selectedAddress);
//   //     addToActiveWallets(selectedAddress);
//   //   },
//   //   [calcWalletData, priorityConnector],
//   // );

//   const connect = useCallback(async (wallet?: Wallet) => {
//     console.log('in new connect function');
//     wallet = undefined;
//     try {
//       if (wallet) {
//         console.log(wallet);
//       } else {
//         const metaMask = supportedWallets.find(
//           (wallet) => wallet.name === 'MetaMask',
//         );
//         await metaMask?.connector?.activate();
//         console.log(metaMask?.connector);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//     // const selectedAddress = getInjectedAddress(wallet);
//     // removeFromDeactivatedWallets(selectedAddress);
//     // addToActiveWallets(selectedAddress);
//   }, []);

//   const disconnect = useCallback(async (wallet?: Wallet) => {
//     // const selectedAddress = getInjectedAddress(wallet);
//     // removeFromActiveWallets(selectedAddress);
//     // addToDeactivatedWallets(selectedAddress);
//     // if (wallet) {
//     //   await currentConnector?.deactivate?.();
//     //   flushCurrentWalletData();
//     // } else if (priorityConnector.deactivate) {
//     //   await priorityConnector.deactivate?.();
//     //   flushCurrentWalletData();
//     // } else {
//     //   await priorityConnector.resetState();
//     //   flushCurrentWalletData();
//     // }
//   }, []);

//   // eager connect
//   // useEffect(() => {
//   //   const selectedAddress = getInjectedAddress();
//   //   if (!isWalletDeactivated(selectedAddress) && priorityConnector) {
//   //     priorityConnector.connectEagerly?.();
//   //     calcWalletData(priorityConnector);
//   //   }
//   // }, [
//   //   priorityConnector,
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   //   (window as any).ethereum?.selectedAddress,
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   //   (window as any).tally?.selectedAddress,
//   // ]);

//   // injected wallet listeners
//   useEffect(() => {
//     const { ethereum } = window as any;
//     const handleChainChanged = async (chainId: string | number) => {
//       await currentConnector?.activate();
//       calcWalletData(currentConnector);
//     };
//     const handleAccountsChanged = async (accounts: string[]) => {
//       if (!accounts.length) {
//         await currentConnector?.deactivate?.();
//         flushCurrentWalletData();
//       }
//     };

//     ethereum?.on('chainChanged', handleChainChanged);
//     ethereum?.on('accountsChanged', handleAccountsChanged);

//     return () => {
//       if (ethereum?.removeListener) {
//         ethereum.removeListener('chainChanged', handleChainChanged);
//         ethereum.removeListener('accountsChanged', handleAccountsChanged);
//       }
//     };
//   }, [currentConnector]);

//   return {
//     connect,
//     disconnect,
//     signer,
//     provider: signer?.provider,
//   };
// };
