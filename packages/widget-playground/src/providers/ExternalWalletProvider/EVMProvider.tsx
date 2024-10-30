import { convertExtendedChain } from '@lifi/wallet-management'
import { useAvailableChains } from '@lifi/widget'
import {
  RainbowKitProvider,
  type Theme as RainbowKitTheme,
  darkTheme,
  getDefaultConfig,
  lightTheme,
  useConnectModal,
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { type FC, type PropsWithChildren, useEffect, useMemo } from 'react'
import type { Chain } from 'viem'
import { WagmiProvider } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { useThemeMode } from '../../hooks/useThemeMode'
import { useWidgetConfigStore } from '../../store/widgetConfig/WidgetConfigProvider'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions'
import { useEnvVariables } from '../EnvVariablesProvider'
import { theme } from '../PlaygroundThemeProvider/theme'

const rkThemeColors = {
  accentColor: theme.palette.primary.main,
  accentColorForeground: theme.palette.common.white,
}

const rkThemeFonts = {
  body: theme.typography.fontFamily,
}

const rkThemeRadii = {
  actionButton: `${theme.shape.borderRadiusSecondary}px`,
  connectButton: `${theme.shape.borderRadiusSecondary}px`,
  menuButton: `${theme.shape.borderRadiusSecondary}px`,
  modal: `${theme.shape.borderRadius}px`,
  modalMobile: `${theme.shape.borderRadius}px`,
}

const RainbowKitModes = {
  dark: {
    ...darkTheme(rkThemeColors),
    fonts: rkThemeFonts,
    radii: rkThemeRadii,
  },
  light: {
    ...lightTheme(rkThemeColors),
    fonts: rkThemeFonts,
    radii: rkThemeRadii,
  },
}

export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const { EVMWalletConnectId } = useEnvVariables()
  const { chains } = useAvailableChains()
  const themeMode = useThemeMode()

  const wagmiConfig = useMemo(() => {
    const _chains: [Chain, ...Chain[]] = chains?.length
      ? (chains.map(convertExtendedChain) as [Chain, ...Chain[]])
      : [mainnet]

    const wagmiConfig = getDefaultConfig({
      appName: 'LI.FI Widget Playground',
      chains: _chains,
      projectId: EVMWalletConnectId,
      ssr: !chains?.length,
    })

    return wagmiConfig
  }, [chains, EVMWalletConnectId])

  return (
    <WagmiProvider
      config={wagmiConfig}
      reconnectOnMount={Boolean(chains?.length)}
    >
      <RainbowKitProvider theme={RainbowKitModes[themeMode] as RainbowKitTheme}>
        <WidgetWalletConfigUpdater />
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  )
}
export const WidgetWalletConfigUpdater = () => {
  const { openConnectModal } = useConnectModal()
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
          openConnectModal?.()
        },
      })
    }
  }, [openConnectModal, setWalletConfig, walletConfig])

  return null
}
