import { Signer } from 'ethers';
import { useEffect, useState } from 'react';
import { useWidgetConfig } from '../providers/WidgetProvider';
import { Token } from '../types';
import {
  addChain as walletAddChain,
  switchChain as walletSwitchChain,
  switchChainAndAddToken,
} from './LiFiWalletManagement/browserWallets';
import { useLifiWalletManagement } from './LiFiWalletManagement/LiFiWalletManagement';
import { Wallet } from './LiFiWalletManagement/wallets';

export interface WalletAccount {
  address?: string;
  isActive?: boolean;
  signer?: Signer;
  chainId?: number;
}

export const useWalletInterface = () => {
  const config = useWidgetConfig();
  const walletManagement = useLifiWalletManagement();
  const [account, setAccount] = useState<WalletAccount>({});

  const connect = async (wallet?: Wallet) => {
    if (!config.useInternalWalletManagement) {
      // TODO
      return;
    }

    await walletManagement.connect(wallet);
  };

  const disconnect = async () => {
    if (!config.useInternalWalletManagement) {
      setAccount({});
    }
    await walletManagement.disconnect();
  };

  // only for injected wallets
  const switchChain = async (chainId: number) => {
    if (config.useInternalWalletManagement) {
      await walletSwitchChain(chainId);
    }
  };

  const addChain = async (chainId: number) => {
    if (config.useInternalWalletManagement) {
      await walletAddChain(chainId);
    }
  };

  const addToken = async (chainId: number, token: Token) => {
    if (config.useInternalWalletManagement) {
      await switchChainAndAddToken(chainId, token);
    }
  };

  // keep account information up to date
  useEffect(() => {
    const updateAccount = async () => {
      if (config.useInternalWalletManagement) {
        const account = await extractAccountFromSigner(walletManagement.signer);

        setAccount(account);
      }
    };
    updateAccount();
  }, [walletManagement.signer, config.useInternalWalletManagement]);

  return {
    connect,
    disconnect,
    switchChain,
    addChain,
    addToken,
    account,
  };
};

const extractAccountFromSigner = async (signer?: Signer) => ({
  address: (await signer?.getAddress()) || undefined,
  isActive: (signer && !!(await signer.getAddress()) === null) || !!signer,
  signer,
  chainId: (await signer?.getChainId()) || undefined,
});
