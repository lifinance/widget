import { isWalletInstalled } from './isWalletInstalled';

export const isWalletInstalledAsync = async (id: string): Promise<boolean> => {
  switch (id) {
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
      return isWalletInstalled(id);
  }
};
