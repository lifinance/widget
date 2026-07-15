'use client'
import type { FormRef, WidgetConfig } from '@lifi/widget/shared'
import { StoreProvider } from '@lifi/widget/shared'
import {
  createOnRampSessionsStore,
  type OnRampError,
  type OnRampFailure,
  type OnRampFundingCategory,
  type OnRampProvider as OnRampProviderAdapter,
  type OnRampSession,
  OnRampSessionsContext,
  type OnRampSessionsStore,
  useOnRampSession,
} from '@lifi/widget-provider/checkout'
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useMemo,
  useRef,
} from 'react'
import { ErrorBoundary } from '../../components/ErrorBoundary.js'
import { useCheckoutFlowStore } from '../../stores/useCheckoutFlowStore.js'

export interface OnRampProviderInfo {
  id: string
  fundingCategory: OnRampFundingCategory
  name: string
  description: string
  features: string[]
  recommended?: boolean
  preconnectOrigins?: string[]
}

const OnRampMetaContext = createContext<OnRampProviderInfo[]>([])

export function useOnRampProviderMetas(): OnRampProviderInfo[] {
  return useContext(OnRampMetaContext)
}

export function useOnRampProviderByCategory(
  category: OnRampFundingCategory | null | undefined
): OnRampProviderInfo | null {
  const metas = useOnRampProviderMetas()
  if (!category) {
    return null
  }
  return metas.find((m) => m.fundingCategory === category) ?? null
}

export function useOnRampSessionByCategory(
  category: OnRampFundingCategory | null | undefined
): OnRampSession | null {
  const provider = useOnRampProviderByCategory(category)
  return useOnRampSession(provider?.id ?? '')
}

export interface ActiveOnRampDeposit {
  failure: OnRampFailure | null
  error: OnRampError | null
  depositTxHash: string | null
  acknowledgeDepositTxHash: () => void
  resolvedDepositAddress: string | null
  fundingSessionId: string | null
  providerName: string
  isOpen: boolean
  isLoading: boolean
}

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
    error: session.error,
    depositTxHash: session.depositTxHash,
    acknowledgeDepositTxHash: session.acknowledgeDepositTxHash,
    resolvedDepositAddress: session.resolvedDepositAddress,
    fundingSessionId: session.fundingSessionId,
    providerName: provider.name,
    isOpen: session.isOpen,
    isLoading: session.isLoading,
  }
}

export interface OnRampProviderRegistryProps extends PropsWithChildren {
  widgetConfig: WidgetConfig
  formRef?: FormRef
  providers: OnRampProviderAdapter[]
}

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
        preconnectOrigins: p.preconnectOrigins,
      })),
    [providers]
  )

  const storeRef = useRef<OnRampSessionsStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createOnRampSessionsStore()
  }

  return (
    <OnRampSessionsContext.Provider value={storeRef.current}>
      <OnRampMetaContext.Provider value={metas}>
        {providers.map((adapter) => {
          const Host = adapter.Host
          return (
            <ErrorBoundary
              key={adapter.id}
              onError={(error) =>
                console.error(
                  `[LifiWidgetCheckout] ${adapter.name} host crashed:`,
                  error
                )
              }
              fallback={() => null}
            >
              <Host widgetConfig={widgetConfig} />
            </ErrorBoundary>
          )
        })}
        <StoreProvider config={widgetConfig} formRef={formRef}>
          {children}
        </StoreProvider>
      </OnRampMetaContext.Provider>
    </OnRampSessionsContext.Provider>
  )
}
