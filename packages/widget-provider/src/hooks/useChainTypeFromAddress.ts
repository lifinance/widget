import { ChainType } from '@lifi/sdk'
import { useCallback } from 'react'
import { useBitcoinContext } from '../contexts/BitcoinContext.js'
import { useEthereumContext } from '../contexts/EthereumContext.js'
import { useSolanaContext } from '../contexts/SolanaContext.js'
import { useStellarContext } from '../contexts/StellarContext.js'
import { useSuiContext } from '../contexts/SuiContext.js'
import { useTronContext } from '../contexts/TronContext.js'

export const useChainTypeFromAddress = (): {
  getChainTypeFromAddress: (address: string) => ChainType | undefined
} => {
  const { sdkProvider: ethereumProvider } = useEthereumContext()
  const { sdkProvider: solanaProvider } = useSolanaContext()
  const { sdkProvider: bitcoinProvider } = useBitcoinContext()
  const { sdkProvider: suiProvider } = useSuiContext()
  const { sdkProvider: tronProvider } = useTronContext()
  const { sdkProvider: stellarProvider } = useStellarContext()

  const getChainTypeFromAddress = useCallback(
    (address: string): ChainType | undefined => {
      if (ethereumProvider?.isAddress(address)) {
        return ChainType.EVM
      }
      if (solanaProvider?.isAddress(address)) {
        return ChainType.SVM
      }
      if (bitcoinProvider?.isAddress(address)) {
        return ChainType.UTXO
      }
      if (suiProvider?.isAddress(address)) {
        return ChainType.MVM
      }
      if (tronProvider?.isAddress(address)) {
        return ChainType.TVM
      }
      if (stellarProvider?.isAddress(address)) {
        return ChainType.STL
      }
    },
    [
      ethereumProvider,
      solanaProvider,
      bitcoinProvider,
      suiProvider,
      tronProvider,
      stellarProvider,
    ]
  )
  return { getChainTypeFromAddress: getChainTypeFromAddress }
}
