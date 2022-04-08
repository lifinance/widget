import { Token } from '@lifinance/sdk';
import { Signer } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import {
  useLifiWalletManagement,
  Wallet,
  addChain as walletAddChain,
  switchChain as walletSwitchChain,
  switchChainAndAddToken,
} from '@lifinance/wallet-management';
import { useWidgetConfig } from '../providers/WidgetProvider';

export interface WalletAccount {
  address?: string;
  isActive?: boolean;
  signer?: Signer;
  chainId?: number;
}

export const useWalletInterface = () => {
  const config = useWidgetConfig();
  const {
    connect: walletManagementConnect,
    disconnect: walletManagementDisconnect,
    signer,
  } = useLifiWalletManagement();
  const [account, setAccount] = useState<WalletAccount>({});

  const connect = useCallback(
    async (wallet?: Wallet) => {
      if (!config.useInternalWalletManagement) {
        // TODO
        return;
      }
      await walletManagementConnect(wallet);
    },
    [config.useInternalWalletManagement, walletManagementConnect],
  );

  const disconnect = useCallback(async () => {
    if (!config.useInternalWalletManagement) {
      setAccount({});
    }
    await walletManagementDisconnect();
  }, [config.useInternalWalletManagement, walletManagementDisconnect]);

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
        const account = await extractAccountFromSigner(signer);

        setAccount(account);
      }
    };
    updateAccount();
  }, [signer, config.useInternalWalletManagement]);

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
