import type { MetaMaskParameters } from 'wagmi/connectors'
import { metaMask } from 'wagmi/connectors'
import { extendConnector } from '../utils/extendConnector'

export const createMetaMaskConnector = /*#__PURE__*/ (
  params: MetaMaskParameters
) => extendConnector(metaMask(params), 'metaMaskSDK', 'MetaMask')
