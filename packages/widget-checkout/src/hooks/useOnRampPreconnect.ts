'use client'
import { useCheckoutConfig } from '@lifi/widget-provider/checkout'
import { useEffect } from 'react'
import { useOnRampProviderByCategory } from '../providers/OnRampProvider/OnRampProvider.js'
import { useCheckoutFlowStore } from '../stores/useCheckoutFlowStore.js'

function toOrigin(url: string): string | null {
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

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
 * the session API origin (a blocking POST) and the provider's iframe hosts.
 */
export function useOnRampPreconnect(): void {
  const { apiUrl } = useCheckoutConfig()
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
    const apiOrigin = apiUrl ? toOrigin(apiUrl) : null
    const targets: { origin: string; crossOrigin?: boolean }[] = [
      // The session endpoint is a CORS fetch — preconnect the CORS pool.
      ...(apiOrigin ? [{ origin: apiOrigin, crossOrigin: true }] : []),
      ...(provider.preconnectOrigins ?? []).map((origin) => ({ origin })),
    ]
    const keys = targets
      .flatMap(({ origin, crossOrigin }) => [
        acquireLink('preconnect', origin, crossOrigin),
        acquireLink('dns-prefetch', origin),
      ])
      .filter((key) => key !== null)
    return () => {
      for (const key of keys) {
        releaseLink(key)
      }
    }
  }, [provider, apiUrl])
}
