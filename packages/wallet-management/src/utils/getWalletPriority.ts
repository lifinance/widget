const walletPriority: Record<string, number> = {
  'io.metamask': 1,
  walletConnect: 2,
  tokenpocket: 3,
  safepal: 4,
  '1inch': 5,
  safe: 6,
  okx: 7,
  coinbaseWalletSDK: 8,
  bitget: 9,
};

export const getWalletPriority = (id: string) => {
  return walletPriority[id] || 1000;
};
