import { ProviderIdentityFlag } from './types';

export const isWalletInstalled = async (id: string): Promise<boolean> => {
  switch (id) {
    case 'default':
      return (
        (window as any).ethereum &&
        !(window as any).ethereum[ProviderIdentityFlag.MetaMask]
      );
    case 'metaMaskSDK':
      return (window as any)?.ethereum?.[ProviderIdentityFlag.MetaMask];
    case 'walletConnect':
      return true;
    case 'coinbaseWalletSDK':
      return (window as any)?.coinbaseWalletExtension;
    case 'app.phantom':
      return (window as any)?.phantom?.ethereum?.isPhantom;
    case 'gate':
      return (window as any)?.gatewallet;
    case 'frontier':
      return (window as any)?.frontier;
    case 'math':
      return (window as any)?.ethereum?.[ProviderIdentityFlag.MathWallet];
    case 'brave':
      return (navigator as any)?.brave && (window as any)._web3Ref;
    case 'safepal':
      return (window as any)?.safepal;
    case 'taho':
      return (
        (window as any)?.tally &&
        (window as any).tally?.[ProviderIdentityFlag.TallyHo]
      );
    case 'block':
      return (window as any)?.ethereum?.[ProviderIdentityFlag.BlockWallet];
    case 'binance':
      return (window as any)?.BinanceChain;
    case 'trust':
      return (window as any)?.trustWallet;
    case 'status':
      return (window as any)?.ethereum?.[ProviderIdentityFlag.Status];
    case 'alpha':
      return (window as any)?.ethereum?.[ProviderIdentityFlag.AlphaWallet];
    case 'bitpie':
      return (window as any)?.ethereum?.Bitpie;
    case 'dcent':
      return (window as any)?.ethereum?.[ProviderIdentityFlag.Dcent];
    case 'frame':
      return (window as any)?.frame;
    case 'hyperpay':
      return (window as any)?.ethereum?.hiWallet;
    case 'imtoken':
      return (window as any)?.ethereum?.[ProviderIdentityFlag.ImToken];
    case 'liquality':
      return (window as any)?.liquality;
    case 'ownbit':
      return (window as any)?.ethereum?.[ProviderIdentityFlag.OwnBit];
    case 'xdefi':
      return (window as any)?.ethereum?.[ProviderIdentityFlag.XDEFI];
    case 'tokenpocket':
      return (
        (window as any)?.ethereum?.[ProviderIdentityFlag.TokenPocket] &&
        !(window as any).ethereum?.[ProviderIdentityFlag.TP]
      );
    case 'oneinch':
      return (window as any)?.ethereum?.[ProviderIdentityFlag.OneInch];
    case 'tokenary':
      return (window as any).ethereum?.[ProviderIdentityFlag.Tokenary];
    case 'okx':
      return (window as any).okxwallet;
    case 'exodus':
      return (window as any).exodus?.ethereum;
    case 'safe': {
      // in Multisig env, window.parent is not equal to window
      const isIFrameEnvironment = window?.parent !== window;

      if (!isIFrameEnvironment) {
        return false;
      }

      const sdk = new (await import('@safe-global/safe-apps-sdk')).default();

      try {
        const accountInfo = await Promise.race([
          sdk.safe.getInfo(),
          new Promise<undefined>((resolve) => setTimeout(resolve, 200)),
        ]);

        return !!accountInfo?.safeAddress;
      } catch (error) {
        return false;
      }
    }

    default:
      return false;
  }
};
