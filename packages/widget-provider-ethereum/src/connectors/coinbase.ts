import type { CoinbaseWalletParameters } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createCoinbaseConnector = async (
  params: CoinbaseWalletParameters
): Promise<CreateConnectorFnExtended> => {
  const { coinbaseWallet } = await import('wagmi/connectors')
  return extendConnector(
    coinbaseWallet(params),
    'coinbaseWalletSDK',
    'Coinbase Wallet'
  )
}
