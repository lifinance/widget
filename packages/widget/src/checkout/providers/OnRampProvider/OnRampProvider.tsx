'use client'
import {
  createContext,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { StoreProvider } from '../../../stores/StoreProvider.js'
import type { FormRef, WidgetConfig } from '../../../types/widget.js'
import { resolveOnRampAdapters } from './resolveAdapters.js'
import type { LoadedOnRampAdapter, OnRampProviderMeta } from './types.js'

export interface OnRampContextValue {
  loading: boolean
  adapters: LoadedOnRampAdapter[]
  availableMetas: OnRampProviderMeta[]
  isAvailable: (id: string) => boolean
}

const OnRampContext = createContext<OnRampContextValue | null>(null)

export function useOnRampContext(): OnRampContextValue {
  const ctx = useContext(OnRampContext)
  if (!ctx) {
    throw new Error('useOnRampContext must be used within OnRampProvider')
  }
  return ctx
}

export interface OnRampProviderProps extends PropsWithChildren {
  widgetConfig: WidgetConfig
  formRef?: FormRef
}

export const OnRampProvider: FC<OnRampProviderProps> = ({
  children,
  widgetConfig,
  formRef,
}) => {
  const [adapters, setAdapters] = useState<LoadedOnRampAdapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    resolveOnRampAdapters().then((resolved) => {
      if (!cancelled) {
        setAdapters(resolved)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<OnRampContextValue>(() => {
    const availableMetas = adapters.map((a) => a.meta)
    return {
      loading,
      adapters,
      availableMetas,
      isAvailable: (id: string) => adapters.some((a) => a.meta.id === id),
    }
  }, [adapters, loading])

  const wrapped = useMemo(() => {
    let tree: ReactNode = (
      <StoreProvider config={widgetConfig} formRef={formRef}>
        {children}
      </StoreProvider>
    )
    for (let i = adapters.length - 1; i >= 0; i--) {
      const { Wrap, meta } = adapters[i]
      tree = (
        <Wrap key={meta.id} widgetConfig={widgetConfig}>
          {tree}
        </Wrap>
      )
    }
    return tree
  }, [adapters, children, formRef, widgetConfig])

  return (
    <OnRampContext.Provider value={value}>{wrapped}</OnRampContext.Provider>
  )
}
