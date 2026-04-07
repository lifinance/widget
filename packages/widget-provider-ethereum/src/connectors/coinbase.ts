import type { CoinbaseWalletParameters } from 'wagmi/connectors'
import { coinbaseWallet } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createCoinbaseConnector = /*#__PURE__*/ (
  params: CoinbaseWalletParameters
): CreateConnectorFnExtended =>
  extendConnector(
    coinbaseWallet(params),
    'coinbaseWalletSDK',
    'Coinbase Wallet'
  )
