import { ChainType } from '@lifi/sdk'
import { useCallback, useMemo } from 'react'
import { useBitcoinContext } from '../contexts/BitcoinContext.js'
import { useEthereumContext } from '../contexts/EthereumContext.js'
import { useSolanaContext } from '../contexts/SolanaContext.js'
import { useStellarContext } from '../contexts/StellarContext.js'
import { useSuiContext } from '../contexts/SuiContext.js'
import { useTronContext } from '../contexts/TronContext.js'
import {
  chainTypeFromAddress,
  chainTypeFromTokenAddress,
  type ProvidersByChainType,
} from '../utils/chainTypeFromAddress.js'

export const useChainTypeFromAddress = (): {
  getChainTypeFromAddress: (address: string) => ChainType | undefined
  /** A token identifier, which several ecosystems shape unlike a wallet address. */
  getChainTypeFromTokenAddress: (address: string) => ChainType | undefined
} => {
  const { sdkProvider: ethereumProvider } = useEthereumContext()
  const { sdkProvider: solanaProvider } = useSolanaContext()
  const { sdkProvider: bitcoinProvider } = useBitcoinContext()
  const { sdkProvider: suiProvider } = useSuiContext()
  const { sdkProvider: tronProvider } = useTronContext()
  const { sdkProvider: stellarProvider } = useStellarContext()

  const providers = useMemo<ProvidersByChainType>(
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

  const getChainTypeFromAddress = useCallback(
    (address: string): ChainType | undefined =>
      chainTypeFromAddress(providers, address),
    [providers]
  )

  const getChainTypeFromTokenAddress = useCallback(
    (address: string): ChainType | undefined =>
      chainTypeFromTokenAddress(providers, address),
    [providers]
  )

  return { getChainTypeFromAddress, getChainTypeFromTokenAddress }
}
