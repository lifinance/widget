import { getConnectorClient as getBigmiConnectorClient } from '@bigmi/client'
import { useConfig as useBigmiConfig } from '@bigmi/react'
import type { SDKProvider } from '@lifi/sdk'
import { ChainType, EVM, Solana, Sui, UTXO, config } from '@lifi/sdk'
import { useCurrentWallet } from '@mysten/dapp-kit'
import type { SignerWalletAdapter } from '@solana/wallet-adapter-base'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { useConfig as useWagmiConfig } from 'wagmi'
import {
  getConnectorClient as getWagmiConnectorClient,
  switchChain,
} from 'wagmi/actions'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'

export const SDKProviders = () => {
  const { sdkConfig } = useWidgetConfig()
  const { wallet } = useWallet()
  const wagmiConfig = useWagmiConfig()
  const bigmiConfig = useBigmiConfig()
  const { currentWallet } = useCurrentWallet()

  useEffect(() => {
    // Configure SDK Providers
    const providers: SDKProvider[] = []
    const hasConfiguredEVMProvider = sdkConfig?.providers?.find(
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
          getWalletClient: () => getWagmiConnectorClient(wagmiConfig),
          switchChain: async (chainId: number) => {
            const chain = await switchChain(wagmiConfig, { chainId })
            return getWagmiConnectorClient(wagmiConfig, { chainId: chain.id })
          },
        })
      )
    }
    if (!hasConfiguredSVMProvider) {
      providers.push(
        Solana({
          async getWalletAdapter() {
            return wallet?.adapter as SignerWalletAdapter
          },
        })
      )
    }
    if (!hasConfiguredUTXOProvider) {
      providers.push(
        UTXO({
          getWalletClient: () => getBigmiConnectorClient(bigmiConfig),
        })
      )
    }
    if (!hasConfiguredSuiProvider) {
      providers.push(
        Sui({
          getWallet: async () => currentWallet!,
        })
      )
    }
    if (sdkConfig?.providers?.length) {
      providers.push(...sdkConfig.providers)
    }
    config.setProviders(providers)
  }, [
    bigmiConfig,
    currentWallet,
    sdkConfig?.providers,
    wagmiConfig,
    wallet?.adapter,
  ])

  return null
}
