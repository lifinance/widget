import type { Connector } from 'wagmi';

export interface WalletListItemButtonProps {
  ecosystemSelection?: boolean;
  onNotInstalled?(connector: Connector): void;
  onConnected?(): void;
  onConnecting?(): void;
  onError?(error: unknown): void;
}
