import type { CoinbaseWalletParameters } from 'wagmi/connectors'
import { coinbaseWallet } from 'wagmi/connectors'
import { extendConnector } from './utils.js'

export const createCoinbaseConnector = /*#__PURE__*/ (
  params: CoinbaseWalletParameters
) =>
  extendConnector(
    coinbaseWallet(params),
    'coinbaseWalletSDK',
    'Coinbase Wallet'
  )
