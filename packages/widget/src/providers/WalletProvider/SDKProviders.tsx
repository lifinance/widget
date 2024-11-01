import { getConnectorClient as getBigmiConnectorClient } from '@bigmi/client'
import { useConfig as useBigmiConfig } from '@bigmi/react'
import type { SDKProvider } from '@lifi/sdk'
import { ChainType, EVM, Solana, UTXO, config } from '@lifi/sdk'
import type { SignerWalletAdapter } from '@solana/wallet-adapter-base'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { useAccount, useConfig as useWagmiConfig } from 'wagmi'
import {
  getConnectorClient as getWagmiConnectorClient,
  switchChain,
} from 'wagmi/actions'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { getSafeMultisigConfig } from './getSafeMultisigConfig.js'

export const SDKProviders = () => {
  const { sdkConfig } = useWidgetConfig()
  const { wallet } = useWallet()
  const wagmiConfig = useWagmiConfig()
  const bigmiConfig = useBigmiConfig()
  const account = useAccount({ config: wagmiConfig })

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
    if (!hasConfiguredEVMProvider) {
      // TODO: refactor this in favor of EIP-5792: Wallet Call API
      const multisig =
        account.connector?.id === 'safe'
          ? getSafeMultisigConfig(account.connector)
          : undefined
      providers.push(
        EVM({
          getWalletClient: () => getWagmiConnectorClient(wagmiConfig),
          switchChain: async (chainId: number) => {
            const chain = await switchChain(wagmiConfig, { chainId })
            return getWagmiConnectorClient(wagmiConfig, { chainId: chain.id })
          },
          multisig,
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
    if (sdkConfig?.providers?.length) {
      providers.push(...sdkConfig.providers)
    }
    config.setProviders(providers)
  }, [
    account.connector,
    bigmiConfig,
    sdkConfig?.providers,
    wagmiConfig,
    wallet?.adapter,
  ])

  return null
}
