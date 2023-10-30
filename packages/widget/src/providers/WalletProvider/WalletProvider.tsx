import type { Signer } from '@ethersproject/abstract-signer';
import type { Web3Provider } from '@ethersproject/providers';
import type { StaticToken } from '@lifi/sdk';
import {
  LiFiWalletManagement,
  readActiveWallets,
  supportedWallets,
  addChain as walletAgnosticAddChain,
  switchChainAndAddToken as walletAgnosticAddToken,
  switchChain as walletAgnosticSwitchChain,
} from '@lifi/wallet-management';
import type { Wallet } from '@lifi/wallet-management/types';
import type { FC, PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useWidgetEvents } from '../../hooks';
import { WidgetEvent } from '../../types';
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
  const emitter = useWidgetEvents();
  const { walletManagement } = useWidgetConfig();
  const [account, setAccount] = useState<WalletAccount>({});
  const [currentWallet, setCurrentWallet] = useState<Wallet | undefined>();

  const handleWalletUpdate = async (wallet?: Wallet) => {
    setCurrentWallet(wallet);
    const account = await extractAccountFromSigner(wallet?.account?.signer);
    setAccount(account);
    return account;
  };

  const connect = useCallback(
    async (wallet: Wallet) => {
      if (walletManagement) {
        const signer = await walletManagement.connect();
        const account = await extractAccountFromSigner(signer);
        setAccount(account);
        emitter.emit(WidgetEvent.WalletConnected, {
          address: account.address,
          chainId: account.chainId,
        });
        return;
      }
      await liFiWalletManagement.connect(wallet);
      wallet.on('walletAccountChanged', handleWalletUpdate);
      const account = await handleWalletUpdate(wallet);
      emitter.emit(WidgetEvent.WalletConnected, {
        address: account.address,
        chainId: account.chainId,
      });
    },
    [emitter, walletManagement],
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
      await handleWalletUpdate(undefined);
    }
  }, [currentWallet, walletManagement]);

  const switchChain = useCallback(
    async (chainId: number) => {
      try {
        if (walletManagement?.switchChain) {
          const signer = await walletManagement.switchChain(chainId);
          const account = await extractAccountFromSigner(signer);
          setAccount(account);
          return signer;
        } else if (!currentWallet) {
          const provider = account.signer?.provider as Web3Provider;
          if (!provider) {
            throw new Error(`Switch chain: No provider available`);
          }
          await walletAgnosticSwitchChain(provider, chainId);
        } else {
          await currentWallet?.switchChain(chainId);
          await handleWalletUpdate(currentWallet);
        }
        // TODO: this will fail if it's not created with ethers 'any' network, replace with the new signer when possible
        return account.signer;
      } catch {
        return account.signer;
      }
    },
    [account.signer, currentWallet, walletManagement],
  );

  const addChain = useCallback(
    async (chainId: number) => {
      try {
        if (walletManagement?.addChain) {
          return walletManagement.addChain(chainId);
        } else if (!currentWallet) {
          const provider = account.signer?.provider as Web3Provider;
          if (!provider) {
            throw new Error(`Add chain: No provider available`);
          }
          await walletAgnosticAddChain(provider, chainId);
        } else {
          await currentWallet?.addChain(chainId);
          await handleWalletUpdate(currentWallet);
        }

        return true;
      } catch {
        return false;
      }
    },
    [account.signer?.provider, currentWallet, walletManagement],
  );

  const addToken = useCallback(
    async (chainId: number, token: StaticToken) => {
      try {
        if (walletManagement?.addToken) {
          return walletManagement.addToken(token, chainId);
        } else if (!currentWallet) {
          const provider = account.signer?.provider as Web3Provider;
          if (!provider) {
            throw new Error(`Add token: No provider available`);
          }
          await walletAgnosticAddToken(provider, chainId, token);
        } else {
          await currentWallet?.addToken(chainId, token);
          await handleWalletUpdate(currentWallet);
        }
      } catch {}
    },
    [account.signer?.provider, currentWallet, walletManagement],
  );

  useEffect(() => {
    const autoConnect = async () => {
      const persistedActiveWallets = readActiveWallets();
      const activeWallets = supportedWallets.filter((wallet) =>
        persistedActiveWallets.some(
          (perstistedWallet) => perstistedWallet.name === wallet.name,
        ),
      );
      if (!activeWallets.length) {
        return;
      }
      await liFiWalletManagement.autoConnect(activeWallets);
      activeWallets[0].on('walletAccountChanged', handleWalletUpdate);
      await handleWalletUpdate(activeWallets[0]);
    };
    autoConnect();
  }, []);

  // keep widget in sync with changing external signer object
  useEffect(() => {
    if (walletManagement) {
      let ignore = false;
      const updateAccount = async () => {
        const account = await extractAccountFromSigner(
          walletManagement?.signer,
        );
        // we should ignore the update if there is a newer one
        if (!ignore) {
          setAccount(account);
        }
      };
      updateAccount();
      return () => {
        ignore = true;
      };
    }
  }, [walletManagement]);

  const value = useMemo(
    () => ({
      connect,
      disconnect,
      switchChain,
      addChain,
      addToken,
      account,
    }),
    [account, addChain, addToken, connect, disconnect, switchChain],
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
    console.error(error);
    return {};
  }
};
