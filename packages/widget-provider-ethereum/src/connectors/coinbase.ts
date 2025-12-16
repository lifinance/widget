import { type CoinbaseWalletParameters, coinbaseWallet } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createCoinbaseConnector = (
  params: CoinbaseWalletParameters
): CreateConnectorFnExtended => {
  return extendConnector(
    coinbaseWallet(params),
    'coinbaseWalletSDK',
    'Coinbase Wallet'
  )
}
