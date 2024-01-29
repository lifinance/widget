import { ChainId, ChainType } from '@lifi/sdk';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import type { Chain } from 'viem';
import type { Connector } from 'wagmi';
import { useAccount as useWagmiAccount } from 'wagmi';

export interface AccountBase {
  address?: string;
  addresses?: readonly string[];
  chain?: Chain;
  chainId?: number;
  chainType?: ChainType;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  isReconnecting: boolean;
  status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected';
}

export interface EVMAccount extends AccountBase {
  chainType: ChainType.EVM;
  connector?: Connector;
}

export interface SVMAccount extends AccountBase {
  chainType: ChainType.SVM;
  connector?: WalletAdapter;
}

export interface DefaultAccount extends AccountBase {
  connector?: never;
}

export type Account = EVMAccount | SVMAccount | DefaultAccount;

export interface AccountResult {
  account: Account;
  /**
   * Connected accounts
   */
  accounts: Account[];
}

interface UseAccountArgs {
  chainType?: ChainType;
}

const defaultAccount: AccountBase = {
  isConnected: false,
  isConnecting: false,
  isReconnecting: false,
  isDisconnected: true,
  status: 'disconnected',
};

/**
 *
 * @param args When we provide args we want to return either account with corresponding chainType or default disconnected one
 * @returns - Account result
 */
export const useAccount = (args?: UseAccountArgs): AccountResult => {
  const account = useWagmiAccount();
  const { wallet } = useWallet();

  // We create a simple variable from the args object
  // to avoid re-render useMemo on every object reference change.
  const hasChainTypeArgs = Boolean(args);

  return useMemo(() => {
    const svm: Account = wallet?.adapter.publicKey
      ? {
          address: wallet?.adapter.publicKey.toString(),
          chainId: ChainId.SOL,
          chainType: ChainType.SVM,
          connector: wallet?.adapter,
          isConnected: Boolean(wallet?.adapter.publicKey),
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: !wallet,
          status: 'connected',
        }
      : {
          chainType: ChainType.SVM,
          isConnected: false,
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: true,
          status: 'disconnected',
        };
    const evm: Account = { ...account, chainType: ChainType.EVM };
    const accounts = [evm, svm];
    const connectedAccounts = [evm, svm].filter(
      (account) => account.isConnected,
    );
    return {
      account: hasChainTypeArgs
        ? accounts.find((account) => account.chainType === args?.chainType) ??
          defaultAccount
        : accounts.find((account) => account.isConnected) ?? defaultAccount,
      // We need to return only connected account list
      accounts: connectedAccounts,
    };
  }, [account, args?.chainType, hasChainTypeArgs, wallet]);
};
