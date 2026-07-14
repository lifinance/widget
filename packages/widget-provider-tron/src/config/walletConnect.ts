import { ChainNetwork } from '@tronweb3/tronwallet-abstract-adapter'
import type { WalletConnectAdapterConfig } from '@tronweb3/tronwallet-adapter-walletconnect'

// Shared with the EVM provider so `walletConnect: true` works with no setup.
const defaultProjectId = '5432e3507d41270bee46b7b85bbc2ef8'

// Upstream matches network names case-sensitively; snap to canonical casing, pass chainIds through.
const normalizeNetwork = (
  network: WalletConnectAdapterConfig['network']
): WalletConnectAdapterConfig['network'] =>
  Object.values(ChainNetwork).find(
    (name) => name.toLowerCase() === network.toLowerCase()
  ) ?? network

export const resolveTronWalletConnectConfig = (
  walletConnect: WalletConnectAdapterConfig | boolean | undefined
): WalletConnectAdapterConfig | undefined => {
  if (!walletConnect) {
    return undefined
  }
  const config = walletConnect === true ? undefined : walletConnect
  return {
    ...config,
    network: normalizeNetwork(config?.network ?? ChainNetwork.Mainnet),
    options: {
      projectId: defaultProjectId,
      ...config?.options,
      // Forced last: isolates Tron's WC session from the EVM connector's (shared project id).
      customStoragePrefix: 'tron',
    },
  }
}
