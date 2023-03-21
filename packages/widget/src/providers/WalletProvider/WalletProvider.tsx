import type { Signer } from '@ethersproject/abstract-signer';
import type { Token } from '@lifi/sdk';
import type { Wallet } from '@lifi/wallet-management';
import { LiFiWalletManagement } from '@lifi/wallet-management';

import type { FC, PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useWidgetConfig } from '../WidgetProvider';
import type { WalletAccount, WalletContextProps } from './types';

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

const liFiWalletManagement = new LiFiWalletManagement();

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletManagement } = useWidgetConfig();
  const [account, setAccount] = useState<WalletAccount>({});
  const [currentWallet, setCurrentWallet] = useState<Wallet | undefined>(
    liFiWalletManagement.connectedWallets[0],
  );
  const testCurrentWallet =
    liFiWalletManagement.connectedWallets[0] || undefined;
  console.log(testCurrentWallet);

  useEffect(() => {
    const sync = async () => {
      const account = await extractAccountFromSigner(
        liFiWalletManagement.connectedWallets[0].connector.account?.signer,
      );
      setAccount(account);
    };
    sync();
  }, [
    liFiWalletManagement.connectedWallets[0]?.connector.account?.address,
    liFiWalletManagement.connectedWallets[0]?.connector.account?.chainId,
    liFiWalletManagement.connectedWallets[0]?.connector.account?.signer,
  ]);

  const connect = useCallback(
    async (wallet: Wallet) => {
      if (walletManagement) {
        const signer = await walletManagement.connect();
        const account = await extractAccountFromSigner(signer);
        setAccount(account);
        return;
      }
      await liFiWalletManagement.connect(wallet);
      const activeWallet = liFiWalletManagement.connectedWallets[0];
      setCurrentWallet(activeWallet);
      const account = await extractAccountFromSigner(
        activeWallet.connector.account?.signer,
      );
      setAccount(account);
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
      setCurrentWallet(undefined);
      setAccount({} as WalletAccount);
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
        await currentWallet?.connector.switchChain(chainId);
        setCurrentWallet(() => currentWallet);
        const account = await extractAccountFromSigner(
          currentWallet?.connector.account?.signer,
        );
        setAccount(account);
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
        await currentWallet?.connector.addChain(chainId);
        setCurrentWallet(() => currentWallet);
        const account = await extractAccountFromSigner(
          currentWallet?.connector.account?.signer,
        );
        setAccount(account);
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
      await currentWallet?.connector.addToken(chainId, token);
      setCurrentWallet(() => currentWallet);
      const account = await extractAccountFromSigner(
        currentWallet?.connector.account?.signer,
      );
      setAccount(account);
      return;
    },
    [walletManagement, currentWallet],
  );

  // // keep account information up to date
  // useEffect(() => {
  //   const updateAccount = async () => {
  //     let account;
  //     if (walletManagement) {
  //       account = await extractAccountFromSigner(walletManagement?.signer);
  //     } else {
  //       account = await extractAccountFromSigner(
  //         currentWallet?.connector.account?.signer,
  //       );
  //     }

  //     setAccount(account);
  //   };
  //   updateAccount();
  // }, [walletManagement, currentWallet]);

  const value = useMemo(
    () => ({
      connect,
      disconnect,
      switchChain,
      addChain,
      addToken,
      account,
      provider: currentWallet?.connector.account?.provider || undefined,
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
