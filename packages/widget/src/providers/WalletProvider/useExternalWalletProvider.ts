import { ChainType } from '@lifi/sdk'
import { useContext, useMemo } from 'react'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { EVMExternalContext } from './EVMExternalContext.js'
import { SVMExternalContext } from './SVMExternalContext.js'
import { SuiExternalContext } from './SuiExternalContext.js'
import { UTXOExternalContext } from './UTXOExternalContext.js'

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
  const hasExternalSVMContext = useContext(SVMExternalContext)
  const hasExternalUTXOContext = useContext(UTXOExternalContext)
  const hasExternalSuiContext = useContext(SuiExternalContext)
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
      hasExternalProvider && !walletConfig?.usePartialWalletManagement
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
  ])

  return data
}
