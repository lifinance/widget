import { Token } from '@lifinance/sdk';
import { Wallet } from '@lifinance/wallet-management';
import { Signer } from 'ethers';

export interface WalletContextProps {
  account: WalletAccount;
  addChain(chainId: number): Promise<void>;
  addToken(chainId: number, token: Token): Promise<void>;
  disconnect(): void;
  switchChain(chainId: number): Promise<boolean>;
  connect(wallet?: Wallet | undefined): Promise<void>;
}

export interface WalletAccount {
  address?: string;
  isActive?: boolean;
  signer?: Signer;
  chainId?: number;
}
