import { JsonRpcSigner } from '@ethersproject/providers';
import { useWidgetConfig } from '../providers/WidgetProvider';
import { Token } from '../types';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from './browserWallets';

class WalletInterface {
  signer: JsonRpcSigner | undefined;

  config = useWidgetConfig();

  connect = async () => {
    // TODO: call user given Hook
    // or
    // TODO: call Lifi WalletManagement
  };

  disconnect = async (address: string) => {
    // TODO: call user given Hook
    // or
    // TODO: call Lifi WalletManagement
  };

  // only for injected Wallets
  switchChain = async (chainId: number) => {
    if (this.config.useLiFiWalletManagement) {
      await switchChain(chainId);
    }
  };

  addChain = async (chainId: number) => {
    if (this.config.useLiFiWalletManagement) {
      await addChain(chainId);
    }
  };

  addToken = async (chainId: number, token: Token) => {
    if (this.config.useLiFiWalletManagement) {
      await switchChainAndAddToken(chainId, token);
    }
  };
}
export {};
