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
    case 'app.phantom.bitcoin':
      return anyWindow.phantom?.bitcoin?.isPhantom
    case 'com.okex.wallet.bitcoin':
      return anyWindow.okxwallet?.bitcoin?.isOkxWallet
    case 'XverseProviders.BitcoinProvider':
      return anyWindow.XverseProviders?.BitcoinProvider
    case 'unisat':
      return (
        anyWindow.unisat &&
        !anyWindow.unisat?.isBinance &&
        !anyWindow.unisat?.isBitKeep
      )
    case 'io.xdefi.bitcoin':
      return anyWindow.xfi?.bitcoin
    case 'so.onekey.app.wallet.bitcoin':
      return anyWindow.$onekey?.btc
    case 'LeatherProvider':
      return anyWindow.LeatherProvider
    case 'bitget':
      return anyWindow.bitkeep?.unisat || anyWindow.unisat?.isBitKeep
    case 'oyl':
      return anyWindow.oyl
    case 'binance':
      return anyWindow.binancew3w?.bitcoin || anyWindow.unisat?.isBinance
    default:
      /**
       * Return true if the wallet is not in the list of explicitly supported or self-injected wallet
       */
      return true
  }
}
