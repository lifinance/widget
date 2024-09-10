import { ChainId, ChainType } from '@lifi/sdk';
import { useConfig as useBigmiConfig } from '@lifi/wallet-management';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import type { Chain } from 'viem';
import type { Connector } from 'wagmi';
import { useAccount as useAccountInternal } from 'wagmi';

export interface AccountBase<CT extends ChainType, ConnectorType = undefined> {
  address?: string;
  addresses?: readonly string[];
  chain?: Chain;
  chainId?: number;
  chainType: CT;
  connector?: ConnectorType;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  isReconnecting: boolean;
  status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected';
}

export type EVMAccount = AccountBase<ChainType.EVM, Connector>;
export type SVMAccount = AccountBase<ChainType.SVM, WalletAdapter>;
export type UTXOAccount = AccountBase<ChainType.UTXO, Connector>;
export type DefaultAccount = AccountBase<ChainType>;

export type Account = EVMAccount | SVMAccount | UTXOAccount | DefaultAccount;

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

const defaultAccount: AccountBase<ChainType> = {
  chainType: ChainType.EVM,
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
  const bigmiConfig = useBigmiConfig();
  const bigmiAccount = useAccountInternal({ config: bigmiConfig });
  const wagmiAccount = useAccountInternal();

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
    const evm: Account = { ...wagmiAccount, chainType: ChainType.EVM };
    const utxo: Account = { ...bigmiAccount, chainType: ChainType.UTXO };
    const accounts = [evm, svm, utxo];
    const connectedAccounts = [evm, svm, utxo].filter(
      (account) => account.isConnected && account.address,
    );
    return {
      account:
        accounts.find(
          (account) =>
            (!hasChainTypeArgs || account.chainType === args?.chainType) &&
            account.isConnected &&
            account.address,
        ) ?? defaultAccount,
      // We need to return only connected account list
      accounts: connectedAccounts,
    };
  }, [wallet, wagmiAccount, bigmiAccount, hasChainTypeArgs, args?.chainType]);
};
