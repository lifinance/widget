import type { CoinbaseWalletParameters } from 'wagmi/connectors';
import { LiFiToolLogo } from '../icons/lifi.js';

export const defaultCoinbaseConfig: CoinbaseWalletParameters = {
  appName: 'LI.FI',
  appLogoUrl: LiFiToolLogo,
};
