import type { Signer } from '@ethersproject/abstract-signer';
import type { Token } from '@lifi/sdk';
import type { Wallet } from '@lifi/wallet-management';
import { LiFiWalletManagement } from '@lifi/wallet-management';
import {
  addChain as walletAddChain,
  switchChain as walletSwitchChain,
  switchChainAndAddToken,
} from '@lifi/wallet-management';
import type { WalletAccount, WalletContextProps } from '@lifi/widget/providers';
import type { FC, PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

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

export const WalletProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [account, setAccount] = useState<WalletAccount>({});
  const [currentWallet, setCurrentWallet] = useState<Wallet | undefined>(
    liFiWalletManagement.connectedWallets[0],
  );

  const connect = useCallback(async (wallet: Wallet) => {
    await liFiWalletManagement.connect(wallet);
  }, []);

  const disconnect = useCallback(async (wallet?: Wallet) => {
    await liFiWalletManagement.disconnect(wallet!);
  }, []);

  // only for injected wallets
  const switchChain = useCallback(async (chainId: number) => {
    return walletSwitchChain(chainId);
  }, []);

  const addChain = useCallback(async (chainId: number) => {
    return walletAddChain(chainId);
  }, []);

  const addToken = useCallback(async (chainId: number, token: Token) => {
    return switchChainAndAddToken(chainId, token);
  }, []);

  // keep account information up to date
  useEffect(() => {
    const updateAccount = async () => {
      const account = await extractAccountFromSigner(
        currentWallet?.connector.account?.signer,
      );
      setAccount(account);
    };

    updateAccount();
  }, [
    currentWallet?.connector?.account?.chainId,
    currentWallet?.connector.account?.signer,
  ]);

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
    <WalletContext.Provider value={value}> {children} </WalletContext.Provider>
  );
};

const extractAccountFromSigner = async (signer?: Signer) => {
  try {
    return {
      address: (await signer?.getAddress()) || undefined,
      isActive: (signer && !!(await signer.getAddress()) === null) || !!signer,
      signer,
      chainId: (await signer?.getChainId()) || undefined,
    };
  } catch {
    return {} as WalletAccount;
  }
};
