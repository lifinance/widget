import type { WalletAdapter } from '@solana/wallet-adapter-base';
import type { Connector } from 'wagmi';
import { getWalletIcon } from '../icons.js';

export const getConnectorIcon = (connector?: Connector | WalletAdapter) => {
  const connectorId = (connector as Connector)?.id;

  return connectorId
    ? getWalletIcon(connectorId) || connector?.icon
    : connector?.icon;
};
