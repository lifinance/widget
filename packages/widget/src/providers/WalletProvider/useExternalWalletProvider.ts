import { ChainType } from '@lifi/sdk'
import {
  useBitcoinContext,
  useEthereumContext,
  useSolanaContext,
  useSuiContext,
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
]

export function useExternalWalletProvider(): ExternalWalletProvider {
  const { walletConfig } = useWidgetConfig()
  const { isExternalContext: hasExternalEthereumContext } = useEthereumContext()
  const { isExternalContext: hasExternalSolanaContext } = useSolanaContext()
  const { isExternalContext: hasExternalBitcoinContext } = useBitcoinContext()
  const { isExternalContext: hasExternalSuiContext } = useSuiContext()
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
    const hasExternalProvider =
      hasExternalEthereumContext ||
      hasExternalSolanaContext ||
      hasExternalBitcoinContext ||
      hasExternalSuiContext

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
    walletConfig?.usePartialWalletManagement,
    walletConfig?.forceInternalWalletManagement,
  ])

  return data
}
