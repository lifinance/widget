const walletPriority: Record<string, number> = {
  metaMaskSDK: 1,
  'io.metamask': 1,
  'io.metamask.mobile': 1,
  coinbaseWalletSDK: 2,
  'com.coinbase.wallet': 2,
  walletConnect: 3,
  safe: 4,
}

export const getWalletPriority = (id: string) => {
  return walletPriority[id] || 1000
}
