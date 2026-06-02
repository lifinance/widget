import type { SDKProvider } from '@lifi/sdk'
import { useMemo } from 'react'
import { useBitcoinContext } from '../contexts/BitcoinContext.js'
import { useEthereumContext } from '../contexts/EthereumContext.js'
import { useSolanaContext } from '../contexts/SolanaContext.js'
import { useSuiContext } from '../contexts/SuiContext.js'
import { useTronContext } from '../contexts/TronContext.js'

export const useSDKProviders = (): SDKProvider[] => {
  const { sdkProvider: evmSDKProvider } = useEthereumContext()
  const { sdkProvider: utxoSDKProvider } = useBitcoinContext()
  const { sdkProvider: svmSDKProvider } = useSolanaContext()
  const { sdkProvider: suiSDKProvider } = useSuiContext()
  const { sdkProvider: tronSDKProvider } = useTronContext()

  return useMemo(
    () =>
      [
        evmSDKProvider,
        utxoSDKProvider,
        svmSDKProvider,
        suiSDKProvider,
        tronSDKProvider,
      ].filter(Boolean) as SDKProvider[],
    [
      evmSDKProvider,
      utxoSDKProvider,
      svmSDKProvider,
      suiSDKProvider,
      tronSDKProvider,
    ]
  )
}
