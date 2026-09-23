export const isWalletInstalled = (id: string): boolean => {
  const anyWindow = typeof window !== 'undefined' ? (window as any) : undefined
  switch (id) {
    case 'metaMask':
      return (
        anyWindow?.ethereum?.isMetaMask ||
        anyWindow?.ethereum?.providers?.some(
          (provider: any) => provider.isMetaMask
        )
      )
    case 'coinbase':
      return (
        // Coinbase Browser doesn't inject itself automatically
        // We should not consider Coinbase Browser as installed wallet so we can fallback to Coinbase SDK
        (anyWindow?.ethereum?.isCoinbaseWallet &&
          !anyWindow?.ethereum?.isCoinbaseBrowser) ||
        anyWindow?.coinbaseWalletExtension?.isCoinbaseWallet ||
        anyWindow?.ethereum?.providers?.some(
          (provider: any) => provider.isCoinbaseWallet
        )
      )
    default:
      /**
       * Bitcoin presence is reported by each bigmi connector's `getProvider()`,
       * which is what `getInstalledConnectors` uses. Answering here duplicated
       * that and drifted from it.
       */
      return true
  }
}
