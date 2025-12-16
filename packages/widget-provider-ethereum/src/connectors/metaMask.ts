import { type MetaMaskParameters, metaMask } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createMetaMaskConnector = (
  params: MetaMaskParameters
): CreateConnectorFnExtended => {
  return extendConnector(metaMask(params), 'metaMaskSDK', 'MetaMask')
}
