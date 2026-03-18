import { WalletManagementProviders } from '@lifi/wallet-management'
import type { WidgetProviderProps } from '@lifi/widget-provider'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useInitializeSDKProviders } from '../../hooks/useInitializeSDKProviders.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { useExternalWalletProvider } from './useExternalWalletProvider.js'

interface WalletProviderProps extends PropsWithChildren {
  providers: ((props: PropsWithChildren<WidgetProviderProps>) => ReactNode)[]
}

export const WalletProvider = ({
  children,
  providers,
}: PropsWithChildren<WalletProviderProps>) => {
  const { walletConfig } = useWidgetConfig()
  const { chains } = useAvailableChains()
  const { i18n } = useTranslation()
  const { useExternalWalletProvidersOnly, internalChainTypes } =
    useExternalWalletProvider()

  // If all chain types are already managed externally (host app set up providers),
  // skip re-composing — the contexts are already populated above us.
  const effectiveProviders = useExternalWalletProvidersOnly ? [] : providers

  return (
    <WalletManagementProviders
      config={{
        locale: i18n.resolvedLanguage as never,
        enabledChainTypes: internalChainTypes,
        walletEcosystemsOrder: walletConfig?.walletEcosystemsOrder,
      }}
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
  return <>{children}</>
}
