'use client'
import {
  type OnRampFailure,
  type OnRampFundingCategory,
  type OnRampProvider as OnRampProviderAdapter,
  type OnRampSession,
  OnRampSessionsContext,
  useOnRampSession,
  useOnRampSessionsRegistry,
} from '@lifi/widget-provider/checkout'
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react'
import { StoreProvider } from '../../../stores/StoreProvider.js'
import type { FormRef, WidgetConfig } from '../../../types/widget.js'
import { CheckoutDepositContractCallsInit } from '../../components/CheckoutDepositContractCallsInit.js'
import { useCheckoutFlowStore } from '../../stores/useCheckoutFlowStore.js'

export interface OnRampProviderInfo {
  id: string
  fundingCategory: OnRampFundingCategory
  name: string
  description: string
  features: string[]
  recommended?: boolean
}

const OnRampMetaContext = createContext<OnRampProviderInfo[]>([])

export function useOnRampProviderMetas(): OnRampProviderInfo[] {
  return useContext(OnRampMetaContext)
}

/** Looks up a registered provider's meta by funding category. */
export function useOnRampProviderByCategory(
  category: OnRampFundingCategory | null | undefined
): OnRampProviderInfo | null {
  const metas = useOnRampProviderMetas()
  if (!category) {
    return null
  }
  return metas.find((m) => m.fundingCategory === category) ?? null
}

/**
 * Returns the registered session for the provider that serves `category`.
 * `useOnRampSession` is called with an empty string when no provider
 * matches, which always returns `null` — preserves rules-of-hooks.
 */
export function useOnRampSessionByCategory(
  category: OnRampFundingCategory | null | undefined
): OnRampSession | null {
  const provider = useOnRampProviderByCategory(category)
  return useOnRampSession(provider?.id ?? '')
}

export interface ActiveOnRampDeposit {
  failure: OnRampFailure | null
  depositTxHash: string | null
  acknowledgeDepositTxHash: () => void
  providerName: string
}

/**
 * Wires the active deposit session for the page that owns the
 * deposit-watching UX. Reads the current `fundingSource` from the
 * checkout flow store, finds the matching provider, and returns its
 * session enriched with the provider's display name.
 */
export function useActiveOnRampDeposit(): ActiveOnRampDeposit | null {
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const category =
    fundingSource === 'cash' || fundingSource === 'exchange'
      ? fundingSource
      : null
  const provider = useOnRampProviderByCategory(category)
  const session = useOnRampSession(provider?.id ?? '')
  if (!provider || !session) {
    return null
  }
  return {
    failure: session.failure,
    depositTxHash: session.depositTxHash,
    acknowledgeDepositTxHash: session.acknowledgeDepositTxHash,
    providerName: provider.name,
  }
}

export interface OnRampProviderRegistryProps extends PropsWithChildren {
  widgetConfig: WidgetConfig
  formRef?: FormRef
  providers: OnRampProviderAdapter[]
}

/**
 * Owns the on-ramp session registry: stores each registered provider's
 * meta and `OnRampSession`. Each Host calls `useRegisterOnRampSession`
 * into `OnRampSessionsContext` on mount; consumers read sessions via
 * `useOnRampSession(id)` (or the higher-level helpers above). Hosts are
 * rendered as flat siblings — they have no children and no shared parent
 * context beyond the registry.
 */
export const OnRampProviderRegistry: FC<OnRampProviderRegistryProps> = ({
  children,
  widgetConfig,
  formRef,
  providers,
}) => {
  const metas = useMemo<OnRampProviderInfo[]>(
    () =>
      providers.map((p) => ({
        id: p.id,
        fundingCategory: p.fundingCategory,
        name: p.name,
        description: p.description,
        features: p.features,
        recommended: p.recommended,
      })),
    [providers]
  )

  const registry = useOnRampSessionsRegistry()

  return (
    <OnRampSessionsContext.Provider value={registry}>
      <OnRampMetaContext.Provider value={metas}>
        {providers.map((adapter) => {
          const Host = adapter.Host
          return <Host key={adapter.id} widgetConfig={widgetConfig} />
        })}
        <StoreProvider config={widgetConfig} formRef={formRef}>
          <CheckoutDepositContractCallsInit />
          {children}
        </StoreProvider>
      </OnRampMetaContext.Provider>
    </OnRampSessionsContext.Provider>
  )
}
