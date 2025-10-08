import { type PortoParameters, porto } from 'wagmi/connectors'
import { extendConnector } from '../utils/extendConnector.js'

export const createPortoConnector = /*#__PURE__*/ (
  params?: Partial<PortoParameters>
) => extendConnector(porto(params), 'xyz.ithaca.porto', 'Porto')
