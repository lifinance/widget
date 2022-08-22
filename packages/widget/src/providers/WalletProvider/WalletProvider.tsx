import type { Token } from '@lifi/sdk';
import type { Wallet } from '@lifi/wallet-management';
import {
  addChain as walletAddChain,
  switchChain as walletSwitchChain,
  switchChainAndAddToken,
  useLiFiWalletManagement,
} from '@lifi/wallet-management';
import type { Signer } from 'ethers';
import type { FC, PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { WidgetWalletManagement } from '../../types';
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

export const WalletProvider: FC<
  PropsWithChildren<{ walletManagement?: WidgetWalletManagement }>
> = ({ children, walletManagement }) => {
  const {
    connect: walletManagementConnect,
    disconnect: walletManagementDisconnect,
    signer,
  } = useLiFiWalletManagement();
  const [account, setAccount] = useState<WalletAccount>({});

  const connect = useCallback(
    async (wallet?: Wallet) => {
      if (walletManagement) {
        const signer = await walletManagement.connect();
        const account = await extractAccountFromSigner(signer);
        setAccount(account);
        return;
      }
      await walletManagementConnect(wallet);
    },
    [walletManagement, walletManagementConnect],
  );

  const disconnect = useCallback(async () => {
    if (walletManagement) {
      await walletManagement.disconnect();
      setAccount({});
      return;
    }
    await walletManagementDisconnect();
  }, [walletManagement, walletManagementDisconnect]);

  // only for injected wallets
  const switchChain = useCallback(
    async (chainId: number) => {
      if (walletManagement?.switchChain) {
        const signer = await walletManagement.switchChain(chainId);
        const account = await extractAccountFromSigner(signer);
        setAccount(account);
        return true;
      }
      return walletSwitchChain(chainId);
    },
    [walletManagement],
  );

  const addChain = useCallback(
    async (chainId: number) => {
      if (walletManagement?.addChain) {
        return walletManagement.addChain(chainId);
      }
      return walletAddChain(chainId);
    },
    [walletManagement],
  );

  const addToken = useCallback(
    async (chainId: number, token: Token) => {
      if (walletManagement?.addToken) {
        return walletManagement.addToken(token, chainId);
      }
      return switchChainAndAddToken(chainId, token);
    },
    [walletManagement],
  );

  // keep account information up to date
  useEffect(() => {
    const updateAccount = async () => {
      const account = await extractAccountFromSigner(
        walletManagement?.signer ?? signer,
      );
      setAccount(account);
    };
    updateAccount();
  }, [signer, walletManagement]);

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
    console.log(error);
    return {};
  }
};
