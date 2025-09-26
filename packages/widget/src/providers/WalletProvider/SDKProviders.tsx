import type { SDKProvider } from '@lifi/sdk'
import { ChainType, config, EVM, Solana, Sui, UTXO } from '@lifi/sdk'
import {
  useEVMContext,
  useMVMContext,
  useSVMContext,
  useUTXOContext,
} from '@lifi/wallet-provider'
import type { SignerWalletAdapter } from '@solana/wallet-adapter-base'
import { useEffect } from 'react'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'

export const SDKProviders = () => {
  const { sdkConfig } = useWidgetConfig()
  const { walletClient: evmWalletClient, switchChain: evmSwitchChain } =
    useEVMContext()
  const { walletClient: utxoWalletClient } = useUTXOContext()
  const { currentWallet: svmWallet } = useSVMContext()
  const { currentWallet: suiWallet } = useMVMContext()

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
    if (!hasConfiguredEVMProvider) {
      providers.push(
        EVM({
          getWalletClient: () => evmWalletClient,
          switchChain: evmSwitchChain,
        })
      )
    }
    if (!hasConfiguredSVMProvider) {
      providers.push(
        Solana({
          async getWalletAdapter() {
            return svmWallet?.adapter as SignerWalletAdapter
          },
        })
      )
    }
    if (!hasConfiguredUTXOProvider) {
      providers.push(
        UTXO({
          getWalletClient: () => utxoWalletClient,
        })
      )
    }
    if (!hasConfiguredSuiProvider) {
      providers.push(
        Sui({
          getWallet: async () => suiWallet!,
        })
      )
    }
    if (sdkConfig?.providers?.length) {
      providers.push(...sdkConfig.providers)
    }
    config.setProviders(providers)
  }, [
    suiWallet,
    sdkConfig?.providers,
    evmWalletClient,
    evmSwitchChain,
    svmWallet?.adapter,
    utxoWalletClient,
  ])

  return null
}
