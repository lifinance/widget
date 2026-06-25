import type { WalletConnectParameters } from 'wagmi/connectors'
import { walletConnect } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createWalletConnectConnector = /*#__PURE__*/ (
  params: WalletConnectParameters
): CreateConnectorFnExtended =>
  extendConnector(
    walletConnect({
      showQrModal: true,
      qrModalOptions: {
        themeVariables: {
          '--wcm-z-index': '3000',
        },
      },
      ...params,
      // Isolate EVM's WC storage from Tron's (shared project id).
      customStoragePrefix: 'evm',
    }),
    'walletConnect',
    'WalletConnect'
  )
