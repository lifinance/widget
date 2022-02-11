import { ChainId } from '@lifinance/sdk';
import { env } from './env';

const rpcs: Record<number, (string | undefined)[]> = {
  [ChainId.ETH]: [env.LIFI_RPC_URL_MAINNET],
  // [ChainId.POL]: [env.LIFI_RPC_URL_POLYGON],
  // [ChainId.BSC]: [env.LIFI_RPC_URL_BSC],
  // [ChainId.DAI]: [env.LIFI_RPC_URL_XDAI],
  // [ChainId.FTM]: [env.LIFI_RPC_URL_FANTOM],
  // [ChainId.ARB]: [env.LIFI_RPC_URL_ARBITRUM],

  // Testnet
  [ChainId.ROP]: [env.LIFI_RPC_URL_ROPSTEN],
  [ChainId.RIN]: [env.LIFI_RPC_URL_RINKEBY],
  [ChainId.GOR]: [env.LIFI_RPC_URL_GORLI],
  [ChainId.KOV]: [env.LIFI_RPC_URL_KOVAN],
  [ChainId.ARBT]: [env.LIFI_RPC_URL_ARBITRUM_RINKEBY],
  [ChainId.OPTT]: [env.LIFI_RPC_URL_OPTIMISM_KOVAN],
  [ChainId.MUM]: [env.LIFI_RPC_URL_POLYGON_MUMBAI],
  [ChainId.BSCT]: [env.LIFI_RPC_URL_BSC_TESTNET],
};

export const getRpcs = (): Record<number, string[]> =>
  Object.fromEntries(
    Object.entries(rpcs).filter(([_, value]) => !value),
  ) as Record<number, string[]>;
