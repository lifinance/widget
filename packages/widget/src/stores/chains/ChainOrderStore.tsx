import { createContext, type JSX, use, useEffect, useRef } from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { useChains } from '../../hooks/useChains.js'
import { useSwapOnly } from '../../hooks/useSwapOnly.js'
import { useExternalWalletProvider } from '../../providers/WalletProvider/useExternalWalletProvider.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { getConfigItemSets, isItemAllowedForSets } from '../../utils/item.js'
import { getDefaultValuesFromQueryString } from '../form/getDefaultValuesFromQueryString.js'
import type { FormType } from '../form/types.js'
import { useFieldActions } from '../form/useFieldActions.js'
import type { PersistStoreProviderProps } from '../types.js'
import { createChainOrderStore } from './createChainOrderStore.js'
import type { ChainOrderState } from './types.js'

type ChainOrderStore = UseBoundStore<StoreApi<ChainOrderState>>

const ChainOrderStoreContext = createContext<ChainOrderStore | null>(null)

export function ChainOrderStoreProvider({
  children,
  ...props
}: PersistStoreProviderProps): JSX.Element {
  const {
    chains: chainsConfig,
    hiddenUI,
    fromChain: fromChainConfig,
    toChain: toChainConfig,
    buildUrl,
  } = useWidgetConfig()
  const storeRef = useRef<ChainOrderStore>(null)
  const { chains } = useChains()
  const { setFieldValue, getFieldValues, isTouched } = useFieldActions()
  const swapOnly = useSwapOnly()
  const { variant } = useWidgetConfig()
  const { externalChainTypes, useExternalWalletProvidersOnly } =
    useExternalWalletProvider()

  if (!storeRef.current) {
    storeRef.current = createChainOrderStore({
      ...props,
    })
  }

  useEffect(() => {
    if (chains) {
      ;(['from', 'to'] as FormType[]).forEach((key) => {
        const configChainIds = chainsConfig?.[key]
        const isFromKey = key === 'from'

        // Convert configChainIds to Sets for O(1) lookup
        const configChainIdsSet = getConfigItemSets(
          configChainIds,
          (chainIds) => new Set(chainIds)
        )
        const filteredChains = chains.filter((chain) => {
          const passesChainsConfigFilter = configChainIdsSet
            ? isItemAllowedForSets(chain.id, configChainIdsSet)
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

        const isSwapTo = swapOnly && key === 'to'

        // Show "All networks" button if there are multiple networks
        const showAllNetworks =
          filteredChains.length > 1 && !hiddenUI?.allNetworks && !isSwapTo

        // Initialize the isAllNetworks with true if the tab is shown,
        // there is no config chain value and no url chain value
        const urlValues = getDefaultValuesFromQueryString({ buildUrl })
        const urlChainValue =
          key === 'from' ? urlValues.fromChain : urlValues.toChain
        const configChainValue =
          key === 'from' ? fromChainConfig : toChainConfig

        // A touched, empty chain field was cleared deliberately — "All
        // networks". It has to outrank the two values above, because both
        // still name the chain the page was opened on at that moment: the
        // query string is rewritten a commit later, and an integrator that
        // seeds its config from the URL never rewrites it.
        const [chainValue] = getFieldValues(`${key}Chain`)
        const clearedForAllNetworks = !chainValue && isTouched(`${key}Chain`)

        const initialIsAllNetworks =
          showAllNetworks &&
          (clearedForAllNetworks || (!configChainValue && !urlChainValue))
        storeRef.current?.getState().setIsAllNetworks(initialIsAllNetworks, key)
        storeRef.current?.getState().setShowAllNetworks(showAllNetworks, key)

        // Copying an empty source would alternate with the fallback below.
        if (isSwapTo) {
          const [fromChainValue] = getFieldValues('fromChain')
          if (fromChainValue) {
            if (fromChainValue !== chainValue) {
              setFieldValue('toChain', fromChainValue)
            }
            return
          }
        }

        // When "All Networks" is active, don't auto-select a chain from the
        // persisted chain order. This prevents stale cross-ecosystem selections
        // (e.g. EVM from + Solana to) from triggering the "destination wallet
        // address required" message after a page refresh.
        if (initialIsAllNetworks) {
          return
        }

        // With no source to follow, drop a destination the list no longer offers.
        const keepsChain =
          chainValue &&
          (!isSwapTo || filteredChains.some((chain) => chain.id === chainValue))
        if (keepsChain) {
          return
        }

        const firstAllowedPinnedChain = storeRef.current
          ?.getState()
          .pinnedChains?.find((chainId) =>
            filteredChains.some((chain) => chain.id === chainId)
          )
        if (
          variant === 'wide' &&
          !hiddenUI?.chainSidebar &&
          firstAllowedPinnedChain
        ) {
          setFieldValue(`${key}Chain`, firstAllowedPinnedChain)
        } else if (chainOrder?.length) {
          setFieldValue(`${key}Chain`, chainOrder[0])
        }
      })
    }
  }, [
    chains,
    chainsConfig,
    externalChainTypes,
    getFieldValues,
    isTouched,
    setFieldValue,
    useExternalWalletProvidersOnly,
    variant,
    hiddenUI,
    swapOnly,
    fromChainConfig,
    toChainConfig,
    buildUrl,
  ])

  return (
    <ChainOrderStoreContext value={storeRef.current}>
      {children}
    </ChainOrderStoreContext>
  )
}

function useChainOrderStoreContext() {
  const useStore = use(ChainOrderStoreContext)
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${ChainOrderStoreProvider.name}>.`
    )
  }
  return useStore
}

export function useChainOrderStore<T>(
  selector: (state: ChainOrderState) => T
): T {
  const useStore = useChainOrderStoreContext()
  return useStore(useShallow(selector))
}
