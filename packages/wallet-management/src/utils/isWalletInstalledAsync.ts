import { isWalletInstalled } from './isWalletInstalled.js'

export const isWalletInstalledAsync = async (id: string): Promise<boolean> => {
  switch (id) {
    case 'safe': {
      // In Safe iframe env, window.parent is not equal to window
      const isIFrameEnvironment = window?.parent !== window

      if (!isIFrameEnvironment) {
        return false
      }

      const SafeAppsSDK: any = (await import('@safe-global/safe-apps-sdk'))
        .default
      const sdk = new SafeAppsSDK()

      try {
        const accountInfo = await Promise.race([
          sdk.safe.getInfo(),
          new Promise((resolve) => setTimeout(resolve, 500)),
        ])

        return !!accountInfo?.safeAddress
      } catch (_error) {
        return false
      }
    }
    default:
      return isWalletInstalled(id)
  }
}
