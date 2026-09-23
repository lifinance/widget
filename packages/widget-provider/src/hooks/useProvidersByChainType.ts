import { ChainType } from '@lifi/sdk'
import { useMemo } from 'react'
import { useBitcoinContext } from '../contexts/BitcoinContext.js'
import { useEthereumContext } from '../contexts/EthereumContext.js'
import { useSolanaContext } from '../contexts/SolanaContext.js'
import { useStellarContext } from '../contexts/StellarContext.js'
import { useSuiContext } from '../contexts/SuiContext.js'
import { useTronContext } from '../contexts/TronContext.js'
import type { ProvidersByChainType } from '../utils/chainTypeFromAddress.js'

export const useProvidersByChainType = (): ProvidersByChainType => {
  const { sdkProvider: ethereumProvider } = useEthereumContext()
  const { sdkProvider: solanaProvider } = useSolanaContext()
  const { sdkProvider: bitcoinProvider } = useBitcoinContext()
  const { sdkProvider: suiProvider } = useSuiContext()
  const { sdkProvider: tronProvider } = useTronContext()
  const { sdkProvider: stellarProvider } = useStellarContext()

  return useMemo<ProvidersByChainType>(
    () => ({
      [ChainType.EVM]: ethereumProvider,
      [ChainType.SVM]: solanaProvider,
      [ChainType.UTXO]: bitcoinProvider,
      [ChainType.MVM]: suiProvider,
      [ChainType.TVM]: tronProvider,
      [ChainType.STL]: stellarProvider,
    }),
    [
      ethereumProvider,
      solanaProvider,
      bitcoinProvider,
      suiProvider,
      tronProvider,
      stellarProvider,
    ]
  )
}
