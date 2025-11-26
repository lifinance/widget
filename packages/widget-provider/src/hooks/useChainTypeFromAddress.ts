import { ChainType } from '@lifi/sdk'
import { useCallback } from 'react'
import { useBitcoinContext } from '../contexts/BitcoinContext.js'
import { useEthereumContext } from '../contexts/EthereumContext.js'
import { useSolanaContext } from '../contexts/SolanaContext.js'
import { useSuiContext } from '../contexts/SuiContext.js'

export const useChainTypeFromAddress = () => {
  const { sdkProvider: ethereumProvider } = useEthereumContext()
  const { sdkProvider: solanaProvider } = useSolanaContext()
  const { sdkProvider: bitcoinProvider } = useBitcoinContext()
  const { sdkProvider: suiProvider } = useSuiContext()

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
    },
    [ethereumProvider, solanaProvider, bitcoinProvider, suiProvider]
  )
  return { getChainTypeFromAddress }
}
