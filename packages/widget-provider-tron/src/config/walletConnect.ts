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
  return {
    ...config,
    // Must be capitalized; lowercase yields an invalid `tron:<name>` id upstream.
    network: config?.network ?? 'Mainnet',
    options: {
      projectId: defaultProjectId,
      // Isolate Tron WC storage from the EVM connector's (shared project id +
      // origin); otherwise its eip155 namespaces leak into the Tron proposal
      // and wallets connect as EVM ("No accounts found in session").
      customStoragePrefix: 'tron',
      ...config?.options,
    },
  }
}
