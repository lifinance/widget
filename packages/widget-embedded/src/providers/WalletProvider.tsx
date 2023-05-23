import type { Signer } from '@ethersproject/abstract-signer';
import type { StaticToken } from '@lifi/sdk';
import type { Wallet } from '@lifi/wallet-management';
import { LiFiWalletManagement } from '@lifi/wallet-management';
import type { WalletAccount, WalletContextProps } from '@lifi/widget/providers';
import type { FC, PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
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

  const handleWalletUpdate = async (wallet?: Wallet) => {
    setCurrentWallet(() => wallet);
    const account = await extractAccountFromSigner(wallet?.account?.signer);
    setAccount(account);
  };

  const connect = useCallback(async (wallet: Wallet) => {
    await liFiWalletManagement.connect(wallet);
    wallet.on('walletAccountChanged', handleWalletUpdate);

    handleWalletUpdate(wallet);
  }, []);

  const disconnect = useCallback(async () => {
    if (currentWallet) {
      await liFiWalletManagement.disconnect(currentWallet);
      currentWallet.removeAllListeners();
      handleWalletUpdate(undefined);
    }
  }, [currentWallet]);

  const switchChain = useCallback(
    async (chainId: number) => {
      try {
        await currentWallet?.switchChain(chainId);
        handleWalletUpdate(currentWallet);
        return currentWallet?.account?.signer;
      } catch {
        return currentWallet?.account?.signer;
      }
    },
    [currentWallet],
  );

  const addChain = useCallback(
    async (chainId: number) => {
      try {
        await currentWallet?.addChain(chainId);
        handleWalletUpdate(currentWallet);

        return true;
      } catch {
        return false;
      }
    },
    [currentWallet],
  );

  const addToken = useCallback(
    async (chainId: number, token: StaticToken) => {
      await currentWallet?.addToken(chainId, token);
      handleWalletUpdate(currentWallet);

      return;
    },
    [currentWallet],
  );

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
