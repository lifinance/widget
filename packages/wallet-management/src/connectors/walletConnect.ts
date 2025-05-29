import type { WalletConnectParameters } from 'wagmi/connectors'
import { walletConnect } from 'wagmi/connectors'
import { extendConnector } from './utils.js'

export const createWalletConnectConnector = /*#__PURE__*/ (
  params: WalletConnectParameters
) =>
  extendConnector(
    walletConnect({
      showQrModal: true,
      qrModalOptions: {
        themeVariables: {
          '--wcm-z-index': '3000',
        },
      },
      ...params,
    }),
    'walletConnect',
    'WalletConnect'
  )
