'use client'
import { useState } from 'react'

const STORAGE_KEY = 'lifi.checkout.userId'

let idSequence = 0

// crypto.randomUUID is unavailable in insecure contexts (plain http).
function generateId(): string {
  const uuid = globalThis.crypto?.randomUUID?.()
  if (uuid) {
    return uuid
  }
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
    return [
      hex.slice(0, 4).join(''),
      hex.slice(4, 6).join(''),
      hex.slice(6, 8).join(''),
      hex.slice(8, 10).join(''),
      hex.slice(10).join(''),
    ].join('-')
  }
  // No Web Crypto at all (non-browser env) — time-based ephemeral id.
  return `lifi-${Date.now().toString(36)}-${(idSequence++).toString(36)}`
}

function getOrCreateCheckoutUserId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return stored
    }
    const id = generateId()
    localStorage.setItem(STORAGE_KEY, id)
    return id
  } catch {
    // localStorage inaccessible — ephemeral UUID for this session.
    return generateId()
  }
}

/**
 * Returns a stable anonymous userId for the checkout session. Reads from /
 * persists to `lifi.checkout.userId` in localStorage; falls back to an
 * ephemeral UUID per mount when storage is unavailable. Providers like Mesh
 * require a stable user id across sessions to resume link tokens and
 * reconcile deposits, so the persistent identifier is intentional.
 */
export function useCheckoutUserId(): string {
  const [userId] = useState(getOrCreateCheckoutUserId)
  return userId
}
