import type { MetaMaskParameters } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createMetaMaskConnector = async (
  params: MetaMaskParameters
): Promise<CreateConnectorFnExtended> => {
  const { metaMask } = await import('wagmi/connectors')
  return extendConnector(metaMask(params), 'metaMaskSDK', 'MetaMask')
}
