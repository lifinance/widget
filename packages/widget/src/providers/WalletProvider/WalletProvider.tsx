import { Token } from '@lifinance/sdk';
import {
  addChain as walletAddChain,
  switchChain as walletSwitchChain,
  switchChainAndAddToken,
  useLifiWalletManagement,
  Wallet,
} from '@lifinance/wallet-management';
import { Signer } from 'ethers';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useWidgetConfig } from '../WidgetProvider';
import type { WalletAccount, WalletContextProps } from './types';

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <WalletProvider>.');
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

export const WalletProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
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
  const switchChain = useCallback(
    async (chainId: number) => {
      if (config.useInternalWalletManagement) {
        return walletSwitchChain(chainId);
      }
      // TODO
      return false;
    },
    [config.useInternalWalletManagement],
  );

  const addChain = useCallback(
    async (chainId: number) => {
      if (config.useInternalWalletManagement) {
        await walletAddChain(chainId);
      }
    },
    [config.useInternalWalletManagement],
  );

  const addToken = useCallback(
    async (chainId: number, token: Token) => {
      if (config.useInternalWalletManagement) {
        await switchChainAndAddToken(chainId, token);
      }
    },
    [config.useInternalWalletManagement],
  );

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

const extractAccountFromSigner = async (signer?: Signer) => ({
  address: (await signer?.getAddress()) || undefined,
  isActive: (signer && !!(await signer.getAddress()) === null) || !!signer,
  signer,
  chainId: (await signer?.getChainId()) || undefined,
});
