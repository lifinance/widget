import type { WalletConnectAdapterConfig } from '@tronweb3/tronwallet-adapters'

// Same project id as the EVM provider — lets `walletConnect: true` work with no setup.
const defaultProjectId = '5432e3507d41270bee46b7b85bbc2ef8'

export const resolveTronWalletConnectConfig = (
  walletConnect: WalletConnectAdapterConfig | boolean | undefined
): WalletConnectAdapterConfig | undefined => {
  if (!walletConnect) {
    return undefined
  }
  const config = walletConnect === true ? undefined : walletConnect
  const network = config?.network ?? 'Mainnet'
  return {
    ...config,
    // Lowercase yields an invalid `tron:<name>` CAIP id upstream.
    network: `${network.charAt(0).toUpperCase()}${network.slice(1)}`,
    options: {
      projectId: defaultProjectId,
      ...config?.options,
      // Forced last: a distinct prefix keeps the EVM connector's eip155
      // namespaces (shared project id) out of the Tron session proposal.
      customStoragePrefix: 'tron',
    },
  }
}
