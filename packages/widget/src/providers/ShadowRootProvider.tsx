'use client'
import createCache, { type EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { createRoot, type Root } from 'react-dom/client'

const ShadowRootContext = createContext<ShadowRoot | undefined>(undefined)

export const useShadowRoot = () => useContext(ShadowRootContext)

export function ShadowRootProvider({ children }: PropsWithChildren) {
  const shadowRootRef = useRef<ShadowRoot | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cacheRef = useRef<EmotionCache | null>(null)
  const rootRef = useRef<Root | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    if (!shadowRootRef.current) {
      const shadowRoot = containerRef.current.attachShadow({ mode: 'open' })
      shadowRootRef.current = shadowRoot

      const shadowContainer = document.createElement('div')
      shadowRoot.appendChild(shadowContainer)

      const cache = createCache({
        key: 'lifi-widget',
        prepend: true,
        container: shadowRoot,
      })
      cacheRef.current = cache

      const root = createRoot(shadowContainer)
      rootRef.current = root
      root.render(
        <ShadowRootContext.Provider value={shadowRoot}>
          <CacheProvider value={cache}>{children}</CacheProvider>
        </ShadowRootContext.Provider>
      )
    } else if (rootRef.current && cacheRef.current) {
      rootRef.current.render(
        <ShadowRootContext.Provider value={shadowRootRef.current}>
          <CacheProvider value={cacheRef.current}>{children}</CacheProvider>
        </ShadowRootContext.Provider>
      )
    }
  }, [children])

  return <div ref={containerRef} id="lifi-widget-shadow-root" />
}
