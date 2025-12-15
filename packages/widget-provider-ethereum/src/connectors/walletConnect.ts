import type { WalletConnectParameters } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createWalletConnectConnector = async (
  params: WalletConnectParameters
): Promise<CreateConnectorFnExtended> => {
  const { walletConnect } = await import('wagmi/connectors')
  return extendConnector(
    walletConnect(params),
    'walletConnect',
    'WalletConnect'
  )
}
