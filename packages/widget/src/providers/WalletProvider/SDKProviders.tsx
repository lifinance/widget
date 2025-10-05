import type { SDKProvider } from '@lifi/sdk'
import { ChainType, config } from '@lifi/sdk'
import {
  useEVMContext,
  useMVMContext,
  useSVMContext,
  useUTXOContext,
} from '@lifi/wallet-provider'
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
    const hasConfiguredEVMProvider = sdkConfig?.providers?.some(
      (provider) => provider.type === ChainType.EVM
    )
    const hasConfiguredSVMProvider = sdkConfig?.providers?.some(
      (provider) => provider.type === ChainType.SVM
    )
    const hasConfiguredUTXOProvider = sdkConfig?.providers?.some(
      (provider) => provider.type === ChainType.UTXO
    )
    const hasConfiguredSuiProvider = sdkConfig?.providers?.some(
      (provider) => provider.type === ChainType.MVM
    )
    if (!hasConfiguredEVMProvider && evmSDKProvider) {
      providers.push(evmSDKProvider)
    }
    if (!hasConfiguredSVMProvider && svmSDKProvider) {
      providers.push(svmSDKProvider)
    }
    if (!hasConfiguredUTXOProvider && utxoSDKProvider) {
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
