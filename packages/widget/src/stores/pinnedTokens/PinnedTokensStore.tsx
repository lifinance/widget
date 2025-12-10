import { createContext, useContext, useRef } from 'react'
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
    <PinnedTokensStoreContext.Provider value={storeRef.current}>
      {children}
    </PinnedTokensStoreContext.Provider>
  )
}

export function usePinnedTokensStore<T>(
  selector: (store: PinnedTokensState) => T
) {
  const useStore = useContext(PinnedTokensStoreContext)

  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${PinnedTokensStoreProvider.name}>.`
    )
  }

  return useStore(useShallow(selector))
}
