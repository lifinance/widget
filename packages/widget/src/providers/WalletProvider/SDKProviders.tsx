import type { SDKProvider } from '@lifi/sdk'
import { ChainType, config } from '@lifi/sdk'
import {
  useEVMContext,
  useMVMContext,
  useSVMContext,
  useUTXOContext,
} from '@lifi/widget-provider'
import { useEffect } from 'react'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'

export const SDKProviders = () => {
  const { sdkConfig } = useWidgetConfig()
  const { sdkProvider: evmSDKProvider } = useEVMContext()
  const { sdkProvider: utxoSDKProvider } = useUTXOContext()
  const { sdkProvider: svmSDKProvider } = useSVMContext()
  const { sdkProvider: suiSDKProvider } = useMVMContext()

  useEffect(() => {
    // Configure SDK Providers
    const providers: SDKProvider[] = []
    const hasConfiguredEthereumProvider = sdkConfig?.providers?.some(
      (provider) => provider.type === ChainType.EVM
    )
    const hasConfiguredSolanaProvider = sdkConfig?.providers?.some(
      (provider) => provider.type === ChainType.SVM
    )
    const hasConfiguredBitcoinProvider = sdkConfig?.providers?.some(
      (provider) => provider.type === ChainType.UTXO
    )
    const hasConfiguredSuiProvider = sdkConfig?.providers?.some(
      (provider) => provider.type === ChainType.MVM
    )
    if (!hasConfiguredEthereumProvider && evmSDKProvider) {
      providers.push(evmSDKProvider)
    }
    if (!hasConfiguredSolanaProvider && svmSDKProvider) {
      providers.push(svmSDKProvider)
    }
    if (!hasConfiguredBitcoinProvider && utxoSDKProvider) {
      providers.push(utxoSDKProvider)
    }
    if (!hasConfiguredSuiProvider && suiSDKProvider) {
      providers.push(suiSDKProvider)
    }
    if (sdkConfig?.providers?.length) {
      providers.push(...sdkConfig.providers)
    }
    config.setProviders(providers)
  }, [
    sdkConfig?.providers,
    evmSDKProvider,
    svmSDKProvider,
    utxoSDKProvider,
    suiSDKProvider,
  ])

  return null
}
