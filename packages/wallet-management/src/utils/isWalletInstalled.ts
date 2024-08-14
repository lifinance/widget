export const isWalletInstalled = (id: string): boolean => {
  const anyWidnow = typeof window !== 'undefined' ? (window as any) : undefined;
  switch (id) {
    case 'metaMask':
      return (
        anyWidnow?.ethereum?.isMetaMask ||
        anyWidnow?.ethereum?.providers?.some(
          (provider: any) => provider.isMetaMask,
        )
      );
    case 'coinbase':
      return (
        anyWidnow?.ethereum?.isCoinbaseWallet ||
        anyWidnow?.coinbaseWalletExtension?.isCoinbaseWallet ||
        anyWidnow?.ethereum?.providers?.some(
          (provider: any) => provider.isCoinbaseWallet,
        )
      );
    case 'gate':
      return anyWidnow?.gatewallet;
    case 'bitget':
      return anyWidnow.bitkeep?.ethereum;
    case 'frontier':
      return anyWidnow?.frontier;
    case 'math':
      return anyWidnow?.ethereum?.isMathWallet;
    case 'brave':
      return (navigator as any)?.brave && anyWidnow._web3Ref;
    case 'safepal':
      return anyWidnow?.safepal;
    case 'taho':
      return anyWidnow?.tally && anyWidnow.tally?.isTally;
    case 'block':
      return anyWidnow?.ethereum?.isBlockWallet;
    case 'binance':
      return anyWidnow?.BinanceChain;
    case 'trust':
      return anyWidnow?.trustWallet;
    case 'status':
      return anyWidnow?.ethereum?.isStatus;
    case 'alpha':
      return anyWidnow?.ethereum?.isAlphaWallet;
    case 'bitpie':
      return anyWidnow?.ethereum?.Bitpie;
    case 'dcent':
      return anyWidnow?.ethereum?.isDcentWallet;
    case 'frame':
      return anyWidnow?.ethereum?.isFrame;
    case 'hyperpay':
      return anyWidnow?.ethereum?.hiWallet;
    case 'imtoken':
      return anyWidnow?.ethereum?.isImToken;
    case 'liquality':
      return anyWidnow?.liquality;
    case 'ownbit':
      return anyWidnow?.ethereum?.isOwnbit;
    case 'xdefi':
      return anyWidnow?.ethereum?.__XDEFI;
    case 'tokenpocket':
      return anyWidnow?.ethereum?.isTokenPocket && !anyWidnow.ethereum?.isTp;
    case '1inch':
      return anyWidnow?.ethereum?.isOneInchIOSWallet;
    case 'tokenary':
      return anyWidnow.ethereum?.isTokenary;
    case 'okx':
      return anyWidnow.okxwallet;
    case 'exodus':
      return anyWidnow.exodus?.ethereum;
    default:
      /**
       * Return true if the wallet is not in the list of explicitly supported or self-injected wallet
       */
      return true;
  }
};
