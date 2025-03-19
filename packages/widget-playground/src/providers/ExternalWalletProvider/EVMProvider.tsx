import { useSyncWagmiConfig } from '@lifi/wallet-management'
import { ChainType, type ExtendedChain, useAvailableChains } from '@lifi/widget'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import {
  SolanaAdapter,
  type Provider as SolanaWalletProvider,
} from '@reown/appkit-adapter-solana'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit-common'
import { bitcoin, mainnet, solana } from '@reown/appkit/networks'
import {
  type AppKit,
  type Provider,
  createAppKit,
  useAppKit,
  useAppKitProvider,
} from '@reown/appkit/react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { type FC, type PropsWithChildren, useEffect, useRef } from 'react'
import { WagmiProvider } from 'wagmi'
import { useThemeMode } from '../../hooks/useThemeMode'
import { useWidgetConfigStore } from '../../store/widgetConfig/WidgetConfigProvider'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions'
import { chainToAppKitNetworks, getChainImagesConfig } from '../../utils/appkit'
import { useEnvVariables } from '../EnvVariablesProvider'
import { SolanaProvider, emitter } from './SolanaProvider'

const metadata = {
  name: 'LI.FI Widget Playground',
  description: 'LI.FI Widget Playground',
  url: 'https://li.fi',
  icons: ['https://avatars.githubusercontent.com/u/85288935'],
}

export function WalletProvider({
  children,
  chains,
}: { children: React.ReactNode; chains: ExtendedChain[] }) {
  const { EVMWalletConnectId } = useEnvVariables()
  const wagmi = useRef<WagmiAdapter | undefined>(undefined)
  const modal = useRef<AppKit | undefined>(undefined)
  const themeMode = useThemeMode()

  if (!wagmi.current || !modal.current) {
    const networks: [AppKitNetwork, ...AppKitNetwork[]] = [solana, bitcoin]
    const evmChains = chains.filter(
      (chain) => chain.chainType === ChainType.EVM
    )
    const evmNetworks = chainToAppKitNetworks(evmChains)
    networks.push(...evmNetworks)

    const chainImages = getChainImagesConfig(evmChains)

    const wagmiAdapter = new WagmiAdapter({
      networks: evmNetworks,
      projectId: EVMWalletConnectId,
      ssr: false,
    })

    const solanaWeb3JsAdapter = new SolanaAdapter({
      wallets: [new PhantomWalletAdapter()],
    })

    const bitcoinAdapter = new BitcoinAdapter({
      projectId: EVMWalletConnectId,
    })

    const appKit = createAppKit({
      adapters: [wagmiAdapter, solanaWeb3JsAdapter, bitcoinAdapter],
      networks,
      projectId: EVMWalletConnectId,
      metadata,
      chainImages,
      themeMode,
      defaultNetwork: mainnet,
    })
    wagmi.current = wagmiAdapter
    modal.current = appKit
  }

  const { wagmiConfig } = wagmi.current

  const { walletProvider: solanaProvider } =
    useAppKitProvider<SolanaWalletProvider>('solana')

  const { walletProvider: evmProvider } = useAppKitProvider<Provider>('eip155')

  useSyncWagmiConfig(wagmiConfig, [], chains)

  useEffect(() => {
    const appKit = modal.current
    if (appKit) {
      appKit.setThemeMode(themeMode)
    }
  }, [themeMode])

  useEffect(() => {
    if (solanaProvider?.name) {
      emitter.emit('connect', solanaProvider.name)
      return () => emitter.emit('disconnect')
    }
  }, [solanaProvider])

  useEffect(() => {
    if (evmProvider) {
      evmProvider.connect()
      return () => {
        evmProvider.disconnect()
      }
    }
  }, [evmProvider])

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <SolanaProvider>{children}</SolanaProvider>
    </WagmiProvider>
  )
}

export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains, isLoading } = useAvailableChains()

  if (!chains || isLoading) {
    return null
  }

  if (!chains.length) {
    return null
  }

  return (
    <WalletProvider chains={chains}>
      <SolanaProvider>
        <WidgetWalletConfigUpdater />
        {children}
      </SolanaProvider>
    </WalletProvider>
  )
}
export const WidgetWalletConfigUpdater = () => {
  const { open } = useAppKit()
  const { setWalletConfig } = useConfigActions()
  const walletConfig = useWidgetConfigStore(
    (store) => store.config?.walletConfig
  )

  useEffect(() => {
    // Due to provider constraints, we're unable to directly assign an onConnect function
    // that opens the external wallet management directly from the widget playground settings component.
    // To work around this limitation, we employ a temporary "hack" by initially setting an empty function.
    // This allows us to later replace it with the intended functionality.
    const onConnectStringified = walletConfig?.onConnect
      ?.toString()
      .replaceAll(' ', '')
    if (onConnectStringified === '()=>{}') {
      setWalletConfig({
        ...walletConfig,
        onConnect: () => {
          open()
        },
      })
    }
  }, [setWalletConfig, walletConfig, open])

  return null
}
