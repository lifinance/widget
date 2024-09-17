import type { CreateConnectorFnExtended } from '@lifi/wallet-management';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import type { Connector } from 'wagmi';

export type WalletConnector =
  | Connector
  | WalletAdapter
  | CreateConnectorFnExtended;
