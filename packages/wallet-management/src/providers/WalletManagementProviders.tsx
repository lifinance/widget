import type { ExtendedChain } from '@lifi/sdk'
import type { WidgetProviderProps } from '@lifi/widget-provider'
import { type PropsWithChildren, type ReactNode, useMemo, useRef } from 'react'
import type { WalletManagementProviderProps } from './WalletManagementProvider/types.js'
import { WalletManagementProvider } from './WalletManagementProvider/WalletManagementProvider.js'

type WidgetProvider = (
  props: PropsWithChildren<WidgetProviderProps>
) => ReactNode

export interface WalletManagementProvidersProps
  extends WalletManagementProviderProps {
  providers?: WidgetProvider[]
  chains?: ExtendedChain[]
  forceInternalWalletManagement?: boolean
}

export const WalletManagementProviders = ({
  config,
  providers,
  chains,
  forceInternalWalletManagement,
  children,
}: PropsWithChildren<WalletManagementProvidersProps>) => {
  const prevProvidersRef = useRef(providers)

  const memoizedProviders = useMemo(() => {
    if (!providers?.length) {
      return prevProvidersRef.current ?? []
    }
    if (
      prevProvidersRef.current?.length === providers.length &&
      prevProvidersRef.current.every((p, i) => p === providers[i])
    ) {
      return prevProvidersRef.current
    }
    prevProvidersRef.current = providers
    return providers
  }, [providers])

  const baseContent = (
    <WalletManagementProvider config={config}>
      {children}
    </WalletManagementProvider>
  )

  if (!memoizedProviders?.length) {
    return baseContent
  }

  return memoizedProviders.reduceRight(
    (acc, ProviderComponent) => (
      <ProviderComponent
        key={ProviderComponent.name}
        forceInternalWalletManagement={forceInternalWalletManagement}
        chains={chains ?? []}
      >
        {acc}
      </ProviderComponent>
    ),
    baseContent
  )
}
