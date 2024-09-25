import type { ChainType } from '@lifi/sdk';

export enum WalletManagementEvent {
  WalletConnected = 'walletConnected',
}

export type WalletManagementEvents = {
  walletConnected: WalletConnected;
};

export interface WalletConnected {
  address?: string;
  chainId?: number;
  chainType?: ChainType;
}
