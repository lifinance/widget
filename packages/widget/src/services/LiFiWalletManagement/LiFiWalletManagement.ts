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

  const eagerConnect = async () => {
    await priorityConnector.activate();
  };

  const connectSpecificWalletProvider = async (
    walletProvider: SupportedWalletProviders,
  ) => {
    switch (walletProvider) {
      case SupportedWalletProviders.MetaMask:
        await metaMask.activate();
        break;
      case SupportedWalletProviders.WalletConnect:
        await walletConnect.activate();
        break;
      default:
        throw Error('Unsupported Wallet Provider');
    }
  };

  const disconnect = async () => {
    await priorityConnector.deactivate();
  };

  return {
    eagerConnect,
    connectSpecificWalletProvider,
    disconnect,
    signer: priorityProvider?.getSigner(),
  };
};
