import { getConnectorClient as getBigmiConnectorClient } from '@bigmi/client'
import { useConfig as useBigmiConfig } from '@bigmi/react'
import type { SDKProvider } from '@lifi/sdk'
import {
  ChainType,
  config,
  EVM,
  Solana,
  Sui,
  /* Tron, */ UTXO,
} from '@lifi/sdk'
import { useCurrentWallet as useSuiCurrentWallet } from '@mysten/dapp-kit'
import type { SignerWalletAdapter } from '@solana/wallet-adapter-base'
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react'
// import {
//   // type Adapter as TronWalletAdapter,
//   useWallet as useTronWallet,
// } from '@tronweb3/tronwallet-adapter-react-hooks'
import { useEffect } from 'react'
import { useConfig as useWagmiConfig } from 'wagmi'
import {
  getConnectorClient as getWagmiConnectorClient,
  switchChain,
} from 'wagmi/actions'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'

export const SDKProviders = () => {
  const { sdkConfig } = useWidgetConfig()
  const { wallet: solanaWallet } = useSolanaWallet()
  const wagmiConfig = useWagmiConfig()
  const bigmiConfig = useBigmiConfig()
  const { currentWallet: suiWallet } = useSuiCurrentWallet()
  // const { wallet: tronWallet } = useTronWallet()

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
    // const hasConfiguredTRNProvider = sdkConfig?.providers?.some(
    //   (provider) => provider.type === ('TRN' as ChainType)
    // )
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
            return solanaWallet?.adapter as SignerWalletAdapter
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
          getWallet: async () => suiWallet!,
        })
      )
    }
    // if (!hasConfiguredTRNProvider) {
    //   providers.push(
    //     Tron({
    //       getWallet: async () => tronWallet?.adapter as TronWalletAdapter,
    //     })
    //   )
    // }
    if (sdkConfig?.providers?.length) {
      providers.push(...sdkConfig.providers)
    }
    config.setProviders(providers)
  }, [
    bigmiConfig,
    suiWallet,
    // tronWallet,
    sdkConfig?.providers,
    wagmiConfig,
    solanaWallet?.adapter,
  ])

  return null
}
