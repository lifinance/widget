export const isWalletInstalled = (id: string): boolean => {
  switch (id) {
    case 'default':
      return (window as any).ethereum && !(window as any).ethereum?.isMetaMask;
    case 'io.metamask':
    case 'metaMaskSDK':
      return (window as any)?.ethereum?.isMetaMask;
    case 'walletConnect':
      return true;
    case 'coinbaseWalletSDK':
      return true;
    case 'app.phantom':
      return (window as any)?.phantom?.ethereum?.isPhantom;
    case 'gate':
      return (window as any)?.gatewallet;
    case 'bitget':
      return (window as any).bitkeep?.ethereum;
    case 'frontier':
      return (window as any)?.frontier;
    case 'math':
      return (window as any)?.ethereum?.isMathWallet;
    case 'brave':
      return (navigator as any)?.brave && (window as any)._web3Ref;
    case 'safepal':
      return (window as any)?.safepal;
    case 'taho':
      return (window as any)?.tally && (window as any).tally?.isTally;
    case 'block':
      return (window as any)?.ethereum?.isBlockWallet;
    case 'binance':
      return (window as any)?.BinanceChain;
    case 'trust':
      return (window as any)?.trustWallet;
    case 'status':
      return (window as any)?.ethereum?.isStatus;
    case 'alpha':
      return (window as any)?.ethereum?.isAlphaWallet;
    case 'bitpie':
      return (window as any)?.ethereum?.Bitpie;
    case 'dcent':
      return (window as any)?.ethereum?.isDcentWallet;
    case 'frame':
      return (window as any)?.frame;
    case 'hyperpay':
      return (window as any)?.ethereum?.hiWallet;
    case 'imtoken':
      return (window as any)?.ethereum?.isImToken;
    case 'liquality':
      return (window as any)?.liquality;
    case 'ownbit':
      return (window as any)?.ethereum?.isOwnbit;
    case 'xdefi':
      return (window as any)?.ethereum?.__XDEFI;
    case 'tokenpocket':
      return (
        (window as any)?.ethereum?.isTokenPocket &&
        !(window as any).ethereum?.isTp
      );
    case '1inch':
      return (window as any)?.ethereum?.isOneInchIOSWallet;
    case 'tokenary':
      return (window as any).ethereum?.isTokenary;
    case 'okx':
      return (window as any).okxwallet;
    case 'exodus':
      return (window as any).exodus?.ethereum;
    default:
      return true;
  }
};
