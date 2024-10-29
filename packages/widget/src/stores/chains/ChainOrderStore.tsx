import { createContext, useContext, useEffect, useRef } from 'react'
import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import { useChains } from '../../hooks/useChains.js'
import { useExternalWalletProvider } from '../../providers/WalletProvider/useExternalWalletProvider.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { isItemAllowed } from '../../utils/item.js'
import type { FormType } from '../form/types.js'
import { useFieldActions } from '../form/useFieldActions.js'
import type { PersistStoreProviderProps } from '../types.js'
import { createChainOrderStore } from './createChainOrderStore.js'
import type { ChainOrderState } from './types.js'

export type ChainOrderStore = UseBoundStoreWithEqualityFn<
  StoreApi<ChainOrderState>
>

export const ChainOrderStoreContext = createContext<ChainOrderStore | null>(
  null
)

export function ChainOrderStoreProvider({
  children,
  ...props
}: PersistStoreProviderProps) {
  const { chains: chainsConfig } = useWidgetConfig()
  const storeRef = useRef<ChainOrderStore>()
  const { chains } = useChains()
  const { setFieldValue, getFieldValues } = useFieldActions()
  const { externalChainTypes, useExternalWalletProvidersOnly } =
    useExternalWalletProvider()

  if (!storeRef.current) {
    storeRef.current = createChainOrderStore(props)
  }

  useEffect(() => {
    if (chains) {
      ;(['from', 'to'] as FormType[]).forEach((key) => {
        const configChainIds = chainsConfig?.[key]
        const isFromKey = key === 'from'

        const filteredChains = chains.filter((chain) => {
          const passesChainsConfigFilter = configChainIds
            ? isItemAllowed(chain.id, configChainIds)
            : true
          // If the integrator uses external wallet management and has not opted in for partial wallet management,
          // restrict the displayed chains to those compatible with external wallet management.
          // This ensures users only see chains for which they can sign transactions.
          const passesWalletConfigFilter = isFromKey
            ? !useExternalWalletProvidersOnly ||
              externalChainTypes.includes(chain.chainType)
            : true
          return passesChainsConfigFilter && passesWalletConfigFilter
        })
        const chainOrder = storeRef.current?.getState().initializeChains(
          filteredChains.map((chain) => chain.id),
          key
        )
        if (chainOrder) {
          const [chainValue] = getFieldValues(`${key}Chain`)
          if (!chainValue) {
            setFieldValue(`${key}Chain`, chainOrder[0])
          }
        }
      })
    }
  }, [
    chains,
    chainsConfig,
    externalChainTypes,
    getFieldValues,
    setFieldValue,
    useExternalWalletProvidersOnly,
  ])

  return (
    <ChainOrderStoreContext.Provider value={storeRef.current}>
      {children}
    </ChainOrderStoreContext.Provider>
  )
}

export function useChainOrderStoreContext() {
  const useStore = useContext(ChainOrderStoreContext)
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${ChainOrderStoreProvider.name}>.`
    )
  }
  return useStore
}

export function useChainOrderStore<T>(
  selector: (state: ChainOrderState) => T,
  equalityFn?: (left: T, right: T) => boolean
): T {
  const useStore = useChainOrderStoreContext()
  return useStore(selector, equalityFn)
}
