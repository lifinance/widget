import { type PortoParameters, porto } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createPortoConnector = /*#__PURE__*/ (
  params?: Partial<PortoParameters>
): CreateConnectorFnExtended =>
  extendConnector(porto(params), 'xyz.ithaca.porto', 'Porto')
