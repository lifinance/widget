import { type PortoParameters, porto } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createPortoConnector = (
  params?: Partial<PortoParameters>
): CreateConnectorFnExtended => {
  return extendConnector(porto(params), 'porto', 'Porto')
}
