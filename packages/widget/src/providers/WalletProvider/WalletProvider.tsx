import type { WalletManagementConfig } from '@lifi/wallet-management'
import { WalletManagementProvider } from '@lifi/wallet-management'
import { type FC, type PropsWithChildren, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import type { WidgetWalletProvidersProps } from '../../types/widget.js'
import { SDKConfigProvider } from '../SDKConfigProvider/SDKConfigProvider.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { useExternalWalletProvider } from './useExternalWalletProvider.js'

export const WalletProvider = ({
  children,
  providers,
}: PropsWithChildren<WidgetWalletProvidersProps>) => {
  const { walletConfig } = useWidgetConfig()
  const { chains } = useAvailableChains()

  let WidgetWithProviders = (
    <>
      <SDKConfigProvider>
        <WalletMenuProvider>{children}</WalletMenuProvider>
      </SDKConfigProvider>
    </>
  )

  for (const ProviderComponent of providers) {
    WidgetWithProviders = (
      <ProviderComponent
        forceInternalWalletManagement={
          walletConfig?.forceInternalWalletManagement
        }
        chains={chains ?? []}
      >
        {WidgetWithProviders}
      </ProviderComponent>
    )
  }

  return WidgetWithProviders
}

const WalletMenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletConfig } = useWidgetConfig()
  const { i18n } = useTranslation()
  const { internalChainTypes } = useExternalWalletProvider()

  const config: WalletManagementConfig = useMemo(() => {
    return {
      locale: i18n.resolvedLanguage as never,
      enabledChainTypes: internalChainTypes,
      walletEcosystemsOrder: walletConfig?.walletEcosystemsOrder,
    }
  }, [
    i18n.resolvedLanguage,
    internalChainTypes,
    walletConfig?.walletEcosystemsOrder,
  ])

  return (
    <WalletManagementProvider config={config}>
      {children}
    </WalletManagementProvider>
  )
}
