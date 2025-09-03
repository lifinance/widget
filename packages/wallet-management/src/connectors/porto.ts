import { porto } from 'porto/wagmi'
import { extendConnector } from './utils.js'

export const createPortoConnector = /*#__PURE__*/ (params?: any) =>
  extendConnector(porto(params), 'porto', 'Porto')
