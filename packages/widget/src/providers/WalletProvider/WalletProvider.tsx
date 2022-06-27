import {
  addChain as walletAddChain,
  switchChain as walletSwitchChain,
  switchChainAndAddToken,
  useLifiWalletManagement,
  Wallet,
} from '@lifi/wallet-management';
import { Token } from '@lifinance/sdk';
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

  useEffect(() => {
    console.log(
      'walletProvider: signer changed',
      config.externalWalletManagementSettings?.signer,
    );
    const updateSigner = async () => {
      const account = await extractAccountFromSigner(
        config.externalWalletManagementSettings?.signer,
      );
      setAccount(account);
      console.log('walletProvider: signer changed account', account);
    };
    updateSigner();
  }, [config.externalWalletManagementSettings?.signer]);

  const connect = useCallback(
    async (wallet?: Wallet) => {
      if (config.disableInternalWalletManagement) {
        const signer = await config.externalWalletManagementSettings.connect();
        const account = await extractAccountFromSigner(signer);
        setAccount(account);
        return;
      }
      await walletManagementConnect(wallet);
    },
    [
      config.disableInternalWalletManagement,
      config.externalWalletManagementSettings,
      walletManagementConnect,
    ],
  );

  const disconnect = useCallback(async () => {
    if (config.disableInternalWalletManagement) {
      await config.externalWalletManagementSettings.disconnect();
      setAccount({});
      return;
    }
    await walletManagementDisconnect();
  }, [
    config.disableInternalWalletManagement,
    config.externalWalletManagementSettings,
    walletManagementDisconnect,
  ]);

  // only for injected wallets
  const switchChain = useCallback(
    async (chainId: number) => {
      if (config.disableInternalWalletManagement) {
        const signer =
          await config.externalWalletManagementSettings.switchChain(chainId);
        const account = await extractAccountFromSigner(signer);
        setAccount(account);
      }
      return walletSwitchChain(chainId);
    },
    [
      config.disableInternalWalletManagement,
      config.externalWalletManagementSettings,
    ],
  );

  const addChain = useCallback(
    async (chainId: number) => {
      if (config.disableInternalWalletManagement) {
        return config.externalWalletManagementSettings.addChain(chainId);
      }
      return walletAddChain(chainId);
    },
    [
      config.disableInternalWalletManagement,
      config.externalWalletManagementSettings,
    ],
  );

  const addToken = useCallback(
    async (chainId: number, token: Token) => {
      if (config.disableInternalWalletManagement) {
        return config.externalWalletManagementSettings.addToken(token, chainId);
      }
      return switchChainAndAddToken(chainId, token);
    },
    [
      config.disableInternalWalletManagement,
      config.externalWalletManagementSettings,
    ],
  );

  const attemptEagerConnect = useCallback(async () => {
    if (config.disableInternalWalletManagement) {
      try {
        const signer =
          await config.externalWalletManagementSettings.provideSigner();
        const account = await extractAccountFromSigner(signer);
        setAccount(() => ({ ...account }));
      } catch (e) {
        console.warn('attempted eagerconnect', e);
      }
    }
  }, [
    config.disableInternalWalletManagement,
    config.externalWalletManagementSettings,
  ]);

  // keep account information up to date
  useEffect(() => {
    const updateAccount = async () => {
      if (!config.disableInternalWalletManagement) {
        const account = await extractAccountFromSigner(signer);
        setAccount(account);
      }
    };
    updateAccount();
  }, [signer, config.disableInternalWalletManagement]);

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
