import type { Signer } from '@ethersproject/abstract-signer';
import type { StaticToken } from '@lifi/sdk';
import type { Wallet } from '@lifi/wallet-management';
import type { Account } from 'viem';

export interface WalletContextProps {
  account: Account;
  addChain(chainId: number): Promise<boolean>;
  addToken(chainId: number, token: StaticToken): Promise<void>;
  disconnect(wallet?: Wallet): void;
  switchChain(chainId: number): Promise<Signer | undefined>;
  connect(wallet?: Wallet | undefined): Promise<void>;
}
