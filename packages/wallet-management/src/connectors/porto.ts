import type { Config } from 'porto/Porto'
import { porto } from 'porto/wagmi'
import { extendConnector } from './utils.js'

export const createPortoConnector = /*#__PURE__*/ (params?: Partial<Config>) =>
  extendConnector(porto(params), 'xyz.ithaca.porto', 'Porto')
