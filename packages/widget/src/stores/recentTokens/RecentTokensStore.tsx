import { type Context, createContext, use, useRef } from 'react'
import { useShallow } from 'zustand/shallow'
import type { PersistStoreProviderProps } from '../types.js'
import { createRecentTokensStore } from './createRecentTokensStore.js'
import type { RecentTokensState, RecentTokensStore } from './types.js'

const RecentTokensStoreContext: Context<RecentTokensStore | null> =
  createContext<RecentTokensStore | null>(null)

export const RecentTokensStoreProvider: React.FC<PersistStoreProviderProps> = ({
  children,
  ...props
}) => {
  const storeRef = useRef<RecentTokensStore>(null)

  if (!storeRef.current) {
    storeRef.current = createRecentTokensStore(props)
  }

  return (
    <RecentTokensStoreContext value={storeRef.current}>
      {children}
    </RecentTokensStoreContext>
  )
}

export function useRecentTokensStore<T>(
  selector: (store: RecentTokensState) => T
): T {
  const useStore = use(RecentTokensStoreContext)

  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${RecentTokensStoreProvider.name}>.`
    )
  }

  return useStore(useShallow(selector))
}
