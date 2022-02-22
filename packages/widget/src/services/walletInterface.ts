import { useWidgetConfig } from '../providers/WidgetProvider';
import { Token } from '../types';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from './browserWallets';
import { usePriorityConnector } from '../hooks/connectorHooks';

export const useWalletInterface = () => {
  const config = useWidgetConfig();
  const connector = usePriorityConnector();

  const connect = async () => {
    if (!config.useLiFiWalletManagement) {
      connector.activate();
    }
  };

  const disconnect = async () => {
    if (!config.useLiFiWalletManagement) {
      connector.deactivate();
    }
  };

  // only for injected Wallets
  const switchChain = async (chainId: number) => {
    if (!config.useLiFiWalletManagement) {
      await switchChain(chainId);
    }
  };

  const addChain = async (chainId: number) => {
    if (!config.useLiFiWalletManagement) {
      await addChain(chainId);
    }
  };

  const addToken = async (chainId: number, token: Token) => {
    if (!config.useLiFiWalletManagement) {
      await switchChainAndAddToken(chainId, token);
    }
  };
  return {
    connect,
    disconnect,
    switchChain,
    addChain,
    addToken,
  };
};
