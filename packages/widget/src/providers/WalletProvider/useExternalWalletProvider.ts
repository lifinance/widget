import { ChainType } from '@lifi/sdk'
import { useContext, useMemo } from 'react'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { EVMExternalContext } from './EVMExternalContext.js'
import { SVMExternalContext } from './SVMExternalContext.js'
import { UTXOExternalContext } from './UTXOExternalContext.js'

interface ExternalWalletProvider {
  useExternalWalletProvidersOnly: boolean
  externalChainTypes: ChainType[]
  internalChainTypes: ChainType[]
}

const internalChainTypes = [ChainType.EVM, ChainType.SVM, ChainType.UTXO]

export function useExternalWalletProvider(): ExternalWalletProvider {
  const { walletConfig } = useWidgetConfig()
  const hasExternalEVMContext = useContext(EVMExternalContext)
  const hasExternalSVMContext = useContext(SVMExternalContext)
  const hasExternalUTXOContext = useContext(UTXOExternalContext)

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
    const hasExternalProvider =
      hasExternalEVMContext || hasExternalSVMContext || hasExternalUTXOContext

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
    walletConfig?.usePartialWalletManagement,
  ])

  return data
}
