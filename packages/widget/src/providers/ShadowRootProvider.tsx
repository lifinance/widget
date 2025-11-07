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

const ShadowRootContext = createContext<ShadowRoot | undefined>(undefined)

export const useShadowRoot = () => useContext(ShadowRootContext)

export function ShadowRootProvider({ children }: PropsWithChildren) {
  const shadowRootRef = useRef<ShadowRoot | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cacheRef = useRef<EmotionCache | null>(null)

  useEffect(() => {
    if (!containerRef.current || shadowRootRef.current) {
      return
    }

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

    import('react-dom/client').then(({ createRoot }) => {
      const root = createRoot(shadowContainer)
      root.render(
        <ShadowRootContext.Provider value={shadowRoot}>
          <CacheProvider value={cache}>{children}</CacheProvider>
        </ShadowRootContext.Provider>
      )
    })
  }, [children])

  return <div ref={containerRef} id="lifi-widget-shadow-root" />
}
