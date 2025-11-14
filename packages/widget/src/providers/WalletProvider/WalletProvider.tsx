import type { WalletManagementConfig } from '@lifi/wallet-management'
import { WalletManagementProvider } from '@lifi/wallet-management'
import { type FC, type PropsWithChildren, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import type { WidgetWalletProvidersProps } from '../../types/widget.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { SDKProviders } from './SDKProviders.js'
import { useExternalWalletProvider } from './useExternalWalletProvider.js'

export const WalletProvider = ({
  children,
  providers,
}: PropsWithChildren<WidgetWalletProvidersProps>) => {
  const { walletConfig } = useWidgetConfig()
  const { chains } = useAvailableChains()

  const baseContent = (
    <>
      <SDKProviders />
      <WalletMenuProvider>{children}</WalletMenuProvider>
    </>
  )

  return providers.reduceRight(
    (acc, ProviderComponent) => (
      <ProviderComponent
        key={ProviderComponent.name}
        forceInternalWalletManagement={
          walletConfig?.forceInternalWalletManagement
        }
        chains={chains ?? []}
      >
        {acc}
      </ProviderComponent>
    ),
    baseContent
  )
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
