import type { Signer } from '@ethersproject/abstract-signer';
import type { Token } from '@lifi/sdk';
import {
  LiFiWalletManagement,
  supportedWallets,
} from '@lifi/wallet-management';
import type { Wallet } from '@lifi/wallet-management/types';

import { FC, PropsWithChildren, useEffect } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useWidgetConfig } from '../WidgetProvider';
import type { WalletAccount, WalletContextProps } from './types';

const liFiWalletManagement = new LiFiWalletManagement();

const stub = (): never => {
  throw new Error(
    `You forgot to wrap your component in <${WalletProvider.name}>.`,
  );
};

const initialContext: WalletContextProps = {
  connect: stub,
  disconnect: stub,
  switchChain: stub,
  addChain: stub,
  addToken: stub,
  account: {},
};

const WalletContext = createContext<WalletContextProps>(initialContext);

export const useWallet = (): WalletContextProps => useContext(WalletContext);

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletManagement } = useWidgetConfig();
  const [account, setAccount] = useState<WalletAccount>({});
  const [currentWallet, setCurrentWallet] = useState<Wallet | undefined>(
    liFiWalletManagement.connectedWallets[0],
  );

  useEffect(() => {
    const autoConnect = async () => {
      const metaMask = supportedWallets.filter(
        (wallet) => wallet.name === 'MetaMask',
      );
      await liFiWalletManagement.autoConnect(metaMask);
      metaMask[0].addListener('walletAccountChanged', handleWalletUpdate);
      handleWalletUpdate(metaMask[0]);
    };
    autoConnect();
  }, []);

  const handleWalletUpdate = async (wallet?: Wallet) => {
    setCurrentWallet(() => wallet);
    const account = await extractAccountFromSigner(wallet?.account?.signer);
    setAccount(account);
  };

  const connect = useCallback(
    async (wallet: Wallet) => {
      if (walletManagement) {
        const signer = await walletManagement.connect();
        const account = await extractAccountFromSigner(signer);
        setAccount(account);
        return;
      }
      await liFiWalletManagement.connect(wallet);
      wallet.addListener('walletAccountChanged', handleWalletUpdate);
      handleWalletUpdate(liFiWalletManagement.connectedWallets[0]);
    },
    [walletManagement],
  );

  const disconnect = useCallback(async () => {
    if (walletManagement) {
      await walletManagement.disconnect();
      setAccount({});
      return;
    }
    if (currentWallet) {
      await liFiWalletManagement.disconnect(currentWallet);
      currentWallet.removeAllListeners();
      handleWalletUpdate(undefined);
    }
  }, [walletManagement, currentWallet]);

  const switchChain = useCallback(
    async (chainId: number) => {
      if (walletManagement?.switchChain) {
        const signer = await walletManagement.switchChain(chainId);
        const account = await extractAccountFromSigner(signer);
        setAccount(account);
        return true;
      }
      try {
        await currentWallet?.switchChain(chainId);
        handleWalletUpdate(currentWallet);
        return true;
      } catch {
        return false;
      }
    },
    [walletManagement, currentWallet],
  );

  const addChain = useCallback(
    async (chainId: number) => {
      if (walletManagement?.addChain) {
        return walletManagement.addChain(chainId);
      }
      try {
        await currentWallet?.addChain(chainId);
        handleWalletUpdate(currentWallet);

        return true;
      } catch {
        return false;
      }
    },
    [walletManagement, currentWallet],
  );

  const addToken = useCallback(
    async (chainId: number, token: Token) => {
      if (walletManagement?.addToken) {
        return walletManagement.addToken(token, chainId);
      }
      await currentWallet?.addToken(chainId, token);
      handleWalletUpdate(currentWallet);

      return;
    },
    [walletManagement, currentWallet],
  );

  const value = useMemo(
    () => ({
      connect,
      disconnect,
      switchChain,
      addChain,
      addToken,
      account,
      provider: currentWallet?.account?.provider || undefined,
    }),
    [
      account,
      addChain,
      addToken,
      connect,
      disconnect,
      currentWallet,
      switchChain,
    ],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const extractAccountFromSigner = async (signer?: Signer) => {
  try {
    return {
      address: await signer?.getAddress(),
      isActive: (signer && !!(await signer.getAddress()) === null) || !!signer,
      signer,
      chainId: await signer?.getChainId(),
    };
  } catch (error) {
    console.log(error);
    return {};
  }
};
