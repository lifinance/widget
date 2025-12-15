import type { PortoParameters } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createPortoConnector = async (
  params?: Partial<PortoParameters>
): Promise<CreateConnectorFnExtended> => {
  const { porto } = await import('wagmi/connectors')
  return extendConnector(porto(params), 'porto', 'Porto')
}
