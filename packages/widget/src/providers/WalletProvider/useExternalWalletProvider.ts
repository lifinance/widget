import { ChainType } from '@lifi/sdk'
import {
  useBitcoinContext,
  useEthereumContext,
  useSolanaContext,
  useStellarContext,
  useSuiContext,
  useTronContext,
} from '@lifi/widget-provider'
import { useMemo } from 'react'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'

interface ExternalWalletProvider {
  useExternalWalletProvidersOnly: boolean
  externalChainTypes: ChainType[]
  internalChainTypes: ChainType[]
}

const internalChainTypes = [
  ChainType.EVM,
  ChainType.SVM,
  ChainType.UTXO,
  ChainType.MVM,
  ChainType.TVM,
  ChainType.STL,
]

export function useExternalWalletProvider(): ExternalWalletProvider {
  const { walletConfig } = useWidgetConfig()
  const { isExternalContext: hasExternalEthereumContext } = useEthereumContext()
  const { isExternalContext: hasExternalSolanaContext } = useSolanaContext()
  const { isExternalContext: hasExternalBitcoinContext } = useBitcoinContext()
  const { isExternalContext: hasExternalSuiContext } = useSuiContext()
  const { isExternalContext: hasExternalTronContext } = useTronContext()
  const { isExternalContext: hasExternalStellarContext } = useStellarContext()
  const data = useMemo(() => {
    const providers: ChainType[] = []
    if (hasExternalEthereumContext) {
      providers.push(ChainType.EVM)
    }
    if (hasExternalSolanaContext) {
      providers.push(ChainType.SVM)
    }
    if (hasExternalBitcoinContext) {
      providers.push(ChainType.UTXO)
    }
    if (hasExternalSuiContext) {
      providers.push(ChainType.MVM)
    }
    if (hasExternalTronContext) {
      providers.push(ChainType.TVM)
    }
    if (hasExternalStellarContext) {
      providers.push(ChainType.STL)
    }
    const hasExternalProvider =
      hasExternalEthereumContext ||
      hasExternalSolanaContext ||
      hasExternalBitcoinContext ||
      hasExternalSuiContext ||
      hasExternalTronContext ||
      hasExternalStellarContext

    const useExternalWalletProvidersOnly =
      hasExternalProvider &&
      !walletConfig?.usePartialWalletManagement &&
      !walletConfig?.forceInternalWalletManagement
    return {
      useExternalWalletProvidersOnly,
      externalChainTypes: providers,
      internalChainTypes: internalChainTypes.filter(
        (chainType) => !providers.includes(chainType)
      ),
    }
  }, [
    hasExternalEthereumContext,
    hasExternalSolanaContext,
    hasExternalBitcoinContext,
    hasExternalSuiContext,
    hasExternalTronContext,
    hasExternalStellarContext,
    walletConfig?.usePartialWalletManagement,
    walletConfig?.forceInternalWalletManagement,
  ])

  return data
}
