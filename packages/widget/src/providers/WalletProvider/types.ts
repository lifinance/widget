import type { Web3Provider } from '@ethersproject/providers';
import type { Token } from '@lifi/sdk';
import type { Wallet } from '@lifi/wallet-management';
import type { Signer } from 'ethers';

export interface WalletContextProps {
  account: WalletAccount;
  provider?: Web3Provider;
  addChain(chainId: number): Promise<boolean>;
  addToken(chainId: number, token: Token): Promise<void>;
  disconnect(): void;
  switchChain(chainId: number): Promise<boolean>;
  connect(wallet?: Wallet | undefined): Promise<void>;
}

export interface WalletAccount {
  isActive?: boolean;
  chainId?: number;
  address?: string;
  signer?: Signer;
}
