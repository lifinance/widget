import type { Signer } from '@ethersproject/abstract-signer';
import type { Provider } from '@ethersproject/providers';
import type { Token } from '@lifi/sdk';
import type { Wallet } from '@lifi/wallet-management';

export interface WalletContextProps {
  account: WalletAccount;
  provider?: Provider;
  addChain(chainId: number): Promise<boolean>;
  addToken(chainId: number, token: Token): Promise<void>;
  disconnect(wallet?: Wallet): void;
  switchChain(chainId: number): Promise<boolean>;
  connect(wallet?: Wallet | undefined): Promise<void>;
}

export interface WalletAccount {
  isActive?: boolean;
  chainId?: number;
  address?: string;
  signer?: Signer;
}
