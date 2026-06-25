import { createContext, use, useRef } from 'react'
import { useShallow } from 'zustand/shallow'
import type { PersistStoreProviderProps } from '../types.js'
import { createPinnedTokensStore } from './createPinnedTokensStore.js'
import type { PinnedTokensState, PinnedTokensStore } from './types.js'

const PinnedTokensStoreContext = createContext<PinnedTokensStore | null>(null)

export const PinnedTokensStoreProvider: React.FC<PersistStoreProviderProps> = ({
  children,
  ...props
}) => {
  const storeRef = useRef<PinnedTokensStore>(null)

  if (!storeRef.current) {
    storeRef.current = createPinnedTokensStore(props)
  }

  return (
    <PinnedTokensStoreContext value={storeRef.current}>
      {children}
    </PinnedTokensStoreContext>
  )
}

export function usePinnedTokensStore<T>(
  selector: (store: PinnedTokensState) => T
): T {
  const useStore = use(PinnedTokensStoreContext)

  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${PinnedTokensStoreProvider.name}>.`
    )
  }

  return useStore(useShallow(selector))
}
