import type { ExtendedChain } from '@lifi/sdk'
import type { WidgetProviderProps } from '@lifi/widget-provider'
import { type PropsWithChildren, type ReactNode, useMemo, useRef } from 'react'

const EMPTY_CHAINS: ExtendedChain[] = []

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
  isExternalContext?: boolean
}

export const WalletManagementProviders = ({
  config,
  providers,
  chains,
  forceInternalWalletManagement,
  isExternalContext,
  children,
}: PropsWithChildren<WalletManagementProvidersProps>): ReactNode => {
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
    (acc, ProviderComponent, index) => (
      <ProviderComponent
        key={ProviderComponent.name || index}
        forceInternalWalletManagement={forceInternalWalletManagement}
        isExternalContext={isExternalContext}
        chains={chains ?? EMPTY_CHAINS}
      >
        {acc}
      </ProviderComponent>
    ),
    baseContent
  )
}
