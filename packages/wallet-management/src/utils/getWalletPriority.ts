const walletPriority: Record<string, number> = {
  metaMaskSDK: 1,
  'io.metamask': 1,
  coinbaseWalletSDK: 2,
  'com.coinbase.wallet': 2,
  walletConnect: 3,
  tokenpocket: 4,
  safepal: 5,
  '1inch': 6,
  safe: 7,
  okx: 8,
  bitget: 9,
};

export const getWalletPriority = (id: string) => {
  return walletPriority[id] || 1000;
};
