export const isWalletInstalled = (id: string): boolean => {
  const anyWindow = typeof window !== 'undefined' ? (window as any) : undefined;
  switch (id) {
    case 'metaMask':
      return (
        anyWindow?.ethereum?.isMetaMask ||
        anyWindow?.ethereum?.providers?.some(
          (provider: any) => provider.isMetaMask,
        )
      );
    case 'coinbase':
      return (
        anyWindow?.ethereum?.isCoinbaseWallet ||
        anyWindow?.coinbaseWalletExtension?.isCoinbaseWallet ||
        anyWindow?.ethereum?.providers?.some(
          (provider: any) => provider.isCoinbaseWallet,
        )
      );
    case 'gate':
      return anyWindow?.gatewallet;
    case 'bitget':
      return anyWindow.bitkeep?.ethereum;
    case 'frontier':
      return anyWindow?.frontier;
    case 'math':
      return anyWindow?.ethereum?.isMathWallet;
    case 'brave':
      return (navigator as any)?.brave && anyWindow._web3Ref;
    case 'safepal':
      return anyWindow?.safepal;
    case 'taho':
      return anyWindow?.tally && anyWindow.tally?.isTally;
    case 'block':
      return anyWindow?.ethereum?.isBlockWallet;
    case 'binance':
      return anyWindow?.BinanceChain;
    case 'trust':
      return anyWindow?.trustWallet;
    case 'status':
      return anyWindow?.ethereum?.isStatus;
    case 'alpha':
      return anyWindow?.ethereum?.isAlphaWallet;
    case 'bitpie':
      return anyWindow?.ethereum?.Bitpie;
    case 'dcent':
      return anyWindow?.ethereum?.isDcentWallet;
    case 'frame':
      return anyWindow?.ethereum?.isFrame;
    case 'hyperpay':
      return anyWindow?.ethereum?.hiWallet;
    case 'imtoken':
      return anyWindow?.ethereum?.isImToken;
    case 'liquality':
      return anyWindow?.liquality;
    case 'ownbit':
      return anyWindow?.ethereum?.isOwnbit;
    case 'xdefi':
      return anyWindow?.ethereum?.__XDEFI;
    case 'tokenpocket':
      return anyWindow?.ethereum?.isTokenPocket && !anyWindow.ethereum?.isTp;
    case '1inch':
      return anyWindow?.ethereum?.isOneInchIOSWallet;
    case 'tokenary':
      return anyWindow.ethereum?.isTokenary;
    case 'okx':
      return anyWindow.okxwallet;
    case 'exodus':
      return anyWindow.exodus?.ethereum;
    default:
      /**
       * Return true if the wallet is not in the list of explicitly supported or self-injected wallet
       */
      return true;
  }
};
