import { type WalletConnectParameters, walletConnect } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createWalletConnectConnector = (
  params: WalletConnectParameters
): CreateConnectorFnExtended => {
  return extendConnector(
    walletConnect(params),
    'walletConnect',
    'WalletConnect'
  )
}
