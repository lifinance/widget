import { Token } from '@lifi/sdk';
import {
  addChain as walletAddChain,
  switchChain as walletSwitchChain,
  switchChainAndAddToken,
  useLifiWalletManagement,
  Wallet,
} from '@lifi/wallet-management';
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
  attemptEagerConnect: stub,
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
      if (config.walletManagement) {
        const signer = await config.walletManagement.connect();
        const account = await extractAccountFromSigner(signer);
        setAccount(account);
        return;
      }
      await walletManagementConnect(wallet);
    },
    [config.walletManagement, walletManagementConnect],
  );

  const disconnect = useCallback(async () => {
    if (config.walletManagement) {
      await config.walletManagement.disconnect();
      setAccount({});
      return;
    }
    await walletManagementDisconnect();
  }, [config.walletManagement, walletManagementDisconnect]);

  // only for injected wallets
  const switchChain = useCallback(
    async (chainId: number) => {
      if (config.walletManagement) {
        const signer = await config.walletManagement.switchChain(chainId);
        const account = await extractAccountFromSigner(signer);
        setAccount(account);
      }
      return walletSwitchChain(chainId);
    },
    [config.walletManagement],
  );

  const addChain = useCallback(
    async (chainId: number) => {
      if (config.walletManagement) {
        return config.walletManagement.addChain(chainId);
      }
      return walletAddChain(chainId);
    },
    [config.walletManagement],
  );

  const addToken = useCallback(
    async (chainId: number, token: Token) => {
      if (config.walletManagement) {
        return config.walletManagement.addToken(token, chainId);
      }
      return switchChainAndAddToken(chainId, token);
    },
    [config.walletManagement],
  );

  const attemptEagerConnect = useCallback(async () => {
    if (config.walletManagement) {
      try {
        const signer = await config.walletManagement.getSigner();
        const account = await extractAccountFromSigner(signer);
        setAccount(() => ({ ...account }));
      } catch (e) {
        console.warn('WalletProvider: attempted eager connect.', e);
      }
    }
  }, [config.walletManagement]);

  // keep account information up to date
  useEffect(() => {
    const updateAccount = async () => {
      if (config.walletManagement) {
        const account = await extractAccountFromSigner(
          config.walletManagement.signer,
        );
        setAccount(account);
      } else {
        const account = await extractAccountFromSigner(signer);
        setAccount(account);
      }
    };
    updateAccount();
  }, [signer, config.walletManagement]);

  const value = useMemo(
    () => ({
      connect,
      disconnect,
      switchChain,
      addChain,
      addToken,
      attemptEagerConnect,
      account,
    }),
    [
      account,
      addChain,
      addToken,
      connect,
      disconnect,
      switchChain,
      attemptEagerConnect,
    ],
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
