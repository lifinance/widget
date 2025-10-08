import { ChainType } from '@lifi/sdk'
import {
  useEVMContext,
  useMVMContext,
  useSVMContext,
  useUTXOContext,
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
  const { isExternalContext: hasExternalEVMContext } = useEVMContext()
  const { isExternalContext: hasExternalSVMContext } = useSVMContext()
  const { isExternalContext: hasExternalUTXOContext } = useUTXOContext()
  const { isExternalContext: hasExternalSuiContext } = useMVMContext()
  const data = useMemo(() => {
    const providers: ChainType[] = []
    if (hasExternalEVMContext) {
      providers.push(ChainType.EVM)
    }
    if (hasExternalSVMContext) {
      providers.push(ChainType.SVM)
    }
    if (hasExternalUTXOContext) {
      providers.push(ChainType.UTXO)
    }
    if (hasExternalSuiContext) {
      providers.push(ChainType.MVM)
    }
    const hasExternalProvider =
      hasExternalEVMContext ||
      hasExternalSVMContext ||
      hasExternalUTXOContext ||
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
    hasExternalEVMContext,
    hasExternalSVMContext,
    hasExternalUTXOContext,
    hasExternalSuiContext,
    walletConfig?.usePartialWalletManagement,
    walletConfig?.forceInternalWalletManagement,
  ])

  return data
}
