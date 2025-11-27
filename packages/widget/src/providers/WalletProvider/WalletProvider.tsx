import type { WalletManagementConfig } from '@lifi/wallet-management'
import { WalletManagementProvider } from '@lifi/wallet-management'
import type { WidgetProviderProps } from '@lifi/widget-provider'
import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
  useRef,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains'
import { useInitializeSDKProviders } from '../../hooks/useInitializeSDKProviders'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider'
import { useExternalWalletProvider } from './useExternalWalletProvider'

interface WalletProviderProps extends PropsWithChildren {
  providers: ((props: PropsWithChildren<WidgetProviderProps>) => ReactNode)[]
}

export const WalletProvider = ({
  children,
  providers,
}: PropsWithChildren<WalletProviderProps>) => {
  const { walletConfig } = useWidgetConfig()
  const { chains } = useAvailableChains()

  const prevProvidersRef = useRef(providers)

  // Memoize providers to maintain referential stability and prevent remounts
  const memoizedProviders = useMemo(() => {
    if (
      prevProvidersRef.current.length === providers.length &&
      prevProvidersRef.current.every(
        (provider, index) => provider === providers[index]
      )
    ) {
      return prevProvidersRef.current
    }
    prevProvidersRef.current = providers
    return providers
  }, [providers])

  const baseContent = <WalletMenuProvider>{children}</WalletMenuProvider>

  return memoizedProviders.reduceRight(
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

  // Initialize SDK client with providers wrapping the wallet menu provider
  useInitializeSDKProviders()

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
