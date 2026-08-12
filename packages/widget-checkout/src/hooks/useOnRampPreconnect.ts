'use client'
import { useEffect } from 'react'
import { useOnRampProviderByCategory } from '../providers/OnRampProvider/OnRampProvider.js'
import { useCheckoutFlowStore } from '../stores/useCheckoutFlowStore.js'

// Ref-counted ownership so overlapping hook instances share one link and the
// last release removes it. Links we didn't create stay unmanaged.
const managedLinks = new Map<string, { el: HTMLLinkElement; count: number }>()

function acquireLink(
  rel: 'preconnect' | 'dns-prefetch',
  origin: string,
  crossOrigin?: boolean
): string | null {
  const key = `${rel}|${origin}`
  const managed = managedLinks.get(key)
  if (managed) {
    managed.count++
    return key
  }
  if (document.head.querySelector(`link[rel="${rel}"][href="${origin}"]`)) {
    return null
  }
  const link = document.createElement('link')
  link.rel = rel
  link.href = origin
  if (crossOrigin) {
    link.crossOrigin = 'anonymous'
  }
  document.head.appendChild(link)
  managedLinks.set(key, { el: link, count: 1 })
  return key
}

function releaseLink(key: string): void {
  const managed = managedLinks.get(key)
  if (!managed) {
    return
  }
  managed.count--
  if (managed.count === 0) {
    managed.el.remove()
    managedLinks.delete(key)
  }
}

/**
 * Warms connections for the active on-ramp provider before its modal opens:
 * the provider's iframe hosts. Hosts perform no HTTP of their own anymore
 * (the widget URL / link token is pre-created server-side by the funding
 * order), so there is no session API origin left to warm.
 */
export function useOnRampPreconnect(): void {
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const provider = useOnRampProviderByCategory(
    fundingSource === 'cash' || fundingSource === 'exchange'
      ? fundingSource
      : null
  )

  useEffect(() => {
    if (!provider) {
      return
    }
    const keys = (provider.preconnectOrigins ?? [])
      .flatMap((origin) => [
        acquireLink('preconnect', origin),
        acquireLink('dns-prefetch', origin),
      ])
      .filter((key) => key !== null)
    return () => {
      for (const key of keys) {
        releaseLink(key)
      }
    }
  }, [provider])
}
