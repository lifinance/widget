'use client'
import type { OnRampProvider as OnRampProviderAdapter } from '@lifi/widget-provider/checkout'
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
import { OnRampDialogs } from '../../components/OnRampDialogs.js'

export interface OnRampProviderInfo {
  id: string
  name: string
  description: string
  features: string[]
  recommended?: boolean
}

const OnRampMetaContext = createContext<OnRampProviderInfo[]>([])

export function useOnRampProviderMetas(): OnRampProviderInfo[] {
  return useContext(OnRampMetaContext)
}

export interface OnRampProviderRegistryProps extends PropsWithChildren {
  widgetConfig: WidgetConfig
  formRef?: FormRef
  providers: OnRampProviderAdapter[]
}

/**
 * Nests each configured on-ramp provider's `Host` around the checkout
 * subtree. Each Host publishes its session via the shared per-provider
 * context exported from `@lifi/widget-provider` (e.g. `TransakContext`),
 * which consumer pages read through `useTransakSession` / `useMeshSession`.
 * The metadata list is exposed separately for funding-source UI lookup.
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
        name: p.name,
        description: p.description,
        features: p.features,
        recommended: p.recommended,
      })),
    [providers]
  )

  return (
    <OnRampMetaContext.Provider value={metas}>
      <OnRampHostsTree
        widgetConfig={widgetConfig}
        providers={providers}
        index={0}
      >
        <StoreProvider config={widgetConfig} formRef={formRef}>
          <CheckoutDepositContractCallsInit />
          <OnRampDialogs />
          {children}
        </StoreProvider>
      </OnRampHostsTree>
    </OnRampMetaContext.Provider>
  )
}

interface OnRampHostsTreeProps extends PropsWithChildren {
  widgetConfig: WidgetConfig
  providers: OnRampProviderAdapter[]
  index: number
}

/**
 * Recursive component that nests each provider's `Host` around `children`.
 * Recursion (vs a `.reduceRight` chain) keeps the React tree stable across
 * renders even when an individual `Host` is a closure.
 */
const OnRampHostsTree: FC<OnRampHostsTreeProps> = ({
  widgetConfig,
  providers,
  index,
  children,
}) => {
  if (index >= providers.length) {
    return <>{children}</>
  }
  const adapter = providers[index]
  const Host = adapter.Host
  return (
    <Host widgetConfig={widgetConfig}>
      <OnRampHostsTree
        widgetConfig={widgetConfig}
        providers={providers}
        index={index + 1}
      >
        {children}
      </OnRampHostsTree>
    </Host>
  )
}
