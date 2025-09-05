import { ChainType } from '@lifi/sdk'
import {
  useSuiContext,
  useSVMContext,
  useUTXOContext,
} from '@lifi/wallet-provider'
import { useContext, useMemo } from 'react'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { EVMExternalContext } from './EVMExternalContext.js'

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
  const hasExternalEVMContext = useContext(EVMExternalContext)
  const { isExternalContext: hasExternalSVMContext } = useSVMContext()
  const { isExternalContext: hasExternalUTXOContext } = useUTXOContext()
  const { isExternalContext: hasExternalSuiContext } = useSuiContext()
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
