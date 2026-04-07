import type { MetaMaskParameters } from 'wagmi/connectors'
import { metaMask } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createMetaMaskConnector = /*#__PURE__*/ (
  params: MetaMaskParameters
): CreateConnectorFnExtended =>
  extendConnector(metaMask(params), 'metaMaskSDK', 'MetaMask')
