import { WalletManagementProviders } from '@lifi/wallet-management'
import {
  useSDKProviders,
  type WidgetProviderProps,
} from '@lifi/widget-provider'
import {
  type FC,
  type JSX,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useInitializeSDKProviders } from '../../hooks/useInitializeSDKProviders.js'
import { withServedDestinationChains } from '../../utils/chainType.js'
import { getConfigItemSets, isItemAllowedForSets } from '../../utils/item.js'
import {
  useWidgetConfig,
  WidgetContext,
} from '../WidgetProvider/WidgetProvider.js'
import { useExternalWalletProvider } from './useExternalWalletProvider.js'

interface WalletProviderProps extends PropsWithChildren {
  providers: ((props: PropsWithChildren<WidgetProviderProps>) => ReactNode)[]
}

export const WalletProvider = ({
  children,
  providers,
}: PropsWithChildren<WalletProviderProps>): JSX.Element => {
  const { walletConfig, chains: chainsConfig } = useWidgetConfig()
  const { chains } = useAvailableChains()
  const { i18n } = useTranslation()
  const { useExternalWalletProvidersOnly, internalChainTypes } =
    useExternalWalletProvider()

  // Restrict offered wallets to the ecosystems allowed by chains.types config.
  const enabledChainTypes = useMemo(() => {
    const chainTypeSets = getConfigItemSets(
      chainsConfig?.types,
      (items) => new Set(items)
    )
    return internalChainTypes.filter((chainType) =>
      isItemAllowedForSets(chainType, chainTypeSets)
    )
  }, [internalChainTypes, chainsConfig?.types])

  if (
    !providers.length &&
    !useExternalWalletProvidersOnly &&
    process.env.NODE_ENV === 'development'
  ) {
    console.warn('No widget providers specified')
  }

  const effectiveProviders = useExternalWalletProvidersOnly ? [] : providers

  const walletManagementConfig = useMemo(
    () => ({
      locale: i18n.resolvedLanguage as never,
      enabledChainTypes,
      walletEcosystemsOrder: walletConfig?.walletEcosystemsOrder,
    }),
    [
      i18n.resolvedLanguage,
      enabledChainTypes,
      walletConfig?.walletEcosystemsOrder,
    ]
  )

  return (
    <WalletManagementProviders
      config={walletManagementConfig}
      providers={effectiveProviders}
      chains={chains}
      forceInternalWalletManagement={
        walletConfig?.forceInternalWalletManagement
      }
    >
      <SDKProviderInitializer>{children}</SDKProviderInitializer>
    </WalletManagementProviders>
  )
}

const SDKProviderInitializer: FC<PropsWithChildren> = ({ children }) => {
  useInitializeSDKProviders()
  const config = useWidgetConfig()
  const sdkProviders = useSDKProviders()
  // Only below the provider components is it known which chains are served.
  // Keyed on `config.chains`: the config object is new on every render.
  const chains = useMemo(
    () => withServedDestinationChains(config.chains, sdkProviders),
    [config.chains, sdkProviders]
  )
  const value = useMemo(
    () => (chains === config.chains ? config : { ...config, chains }),
    [config, chains]
  )
  return <WidgetContext value={value}>{children}</WidgetContext>
}
