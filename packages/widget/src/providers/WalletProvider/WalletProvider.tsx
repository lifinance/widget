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
import { useFormContext } from 'react-hook-form';
import { useChainOrderStore } from '../../stores/chains';
import { SwapFormKey } from '../SwapFormProvider';
import { isItemAllowed, useWidgetConfig } from '../WidgetProvider';
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

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletManagement, fromChain, toChain, chains, disabledChains } =
    useWidgetConfig();
  const methods = useFormContext();
  const {
    connect: walletManagementConnect,
    disconnect: walletManagementDisconnect,
    signer,
    provider,
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
      let account;
      if (walletManagement) {
        account = await extractAccountFromSigner(walletManagement?.signer);
      } else {
        account = await extractAccountFromSigner(signer);
      }

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
      provider,
    }),
    [account, addChain, addToken, connect, disconnect, provider, switchChain],
  );

  // Set wallet chain as default if no chains are provided by config and if they were not changed during widget usage
  useEffect(() => {
    const chainAllowed =
      account.chainId && isItemAllowed(account.chainId, chains, disabledChains);
    if (!account.isActive || !account.chainId || !chainAllowed) {
      return;
    }

    const [fromChainValue, toChainValue] = methods.getValues([
      SwapFormKey.FromChain,
      SwapFormKey.ToChain,
    ]);

    const { isDirty: isFromChainDirty } = methods.getFieldState(
      SwapFormKey.FromChain,
      methods.formState,
    );
    const { isDirty: isToChainDirty } = methods.getFieldState(
      SwapFormKey.ToChain,
      methods.formState,
    );
    const { isDirty: isFromTokenDirty } = methods.getFieldState(
      SwapFormKey.FromToken,
      methods.formState,
    );
    const { isDirty: isToTokenDirty } = methods.getFieldState(
      SwapFormKey.ToToken,
      methods.formState,
    );

    const { chainOrder, setChain } = useChainOrderStore.getState();

    // Users can switch chains in the wallet.
    // If we don't have a chain in the ordered chain list we should add it.
    setChain(account.chainId);

    // If we ran out of slots for the ordered chain list and the current chain isn't there
    // we should make a recently switched chain as current.
    const hasFromChainInOrderedList = chainOrder.includes(fromChainValue);
    const hasToChainInOrderedList = chainOrder.includes(toChainValue);

    if (
      (!fromChain && !isFromChainDirty && !isFromTokenDirty) ||
      !hasFromChainInOrderedList
    ) {
      methods.setValue(SwapFormKey.FromChain, account.chainId, {
        shouldDirty: false,
      });
      methods.setValue(SwapFormKey.FromToken, '', {
        shouldDirty: false,
      });
      methods.setValue(SwapFormKey.FromAmount, '', {
        shouldDirty: false,
      });
    }
    if (
      (!toChain && !isToChainDirty && !isToTokenDirty) ||
      !hasToChainInOrderedList
    ) {
      methods.setValue(SwapFormKey.ToChain, account.chainId, {
        shouldDirty: false,
      });
      methods.setValue(SwapFormKey.ToToken, '', {
        shouldDirty: false,
      });
    }
  }, [
    account.chainId,
    account.isActive,
    chains,
    disabledChains,
    fromChain,
    methods,
    toChain,
  ]);

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
