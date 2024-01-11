import type { CoinbaseWalletParameters } from '@wagmi/connectors';
import { coinbaseWallet } from '@wagmi/connectors';

export const createCoinbaseConnector = /*@__PURE__*/ (
  params: CoinbaseWalletParameters,
) => coinbaseWallet(params);
