import type { SDKProvider } from '@lifi/sdk'
import { useMemo } from 'react'
import { useBitcoinContext } from '../contexts/BitcoinContext.js'
import { useEthereumContext } from '../contexts/EthereumContext.js'
import { useSolanaContext } from '../contexts/SolanaContext.js'
import { useStellarContext } from '../contexts/StellarContext.js'
import { useSuiContext } from '../contexts/SuiContext.js'
import { useTronContext } from '../contexts/TronContext.js'
import { useZcashContext } from '../contexts/ZcashContext.js'

export const useSDKProviders = (): SDKProvider[] => {
  const { sdkProvider: evmSDKProvider } = useEthereumContext()
  const { sdkProvider: utxoSDKProvider } = useBitcoinContext()
  const { sdkProvider: zcashSDKProvider } = useZcashContext()
  const { sdkProvider: svmSDKProvider } = useSolanaContext()
  const { sdkProvider: suiSDKProvider } = useSuiContext()
  const { sdkProvider: tronSDKProvider } = useTronContext()
  const { sdkProvider: stellarSDKProvider } = useStellarContext()

  return useMemo(
    () =>
      [
        evmSDKProvider,
        utxoSDKProvider,
        // After Bitcoin, so a lookup by chain type alone still finds Bitcoin.
        zcashSDKProvider,
        svmSDKProvider,
        suiSDKProvider,
        tronSDKProvider,
        stellarSDKProvider,
      ].filter(Boolean) as SDKProvider[],
    [
      evmSDKProvider,
      utxoSDKProvider,
      zcashSDKProvider,
      svmSDKProvider,
      suiSDKProvider,
      tronSDKProvider,
      stellarSDKProvider,
    ]
  )
}
