import { useState } from 'react'

const STORAGE_KEY = 'lifi.checkout.userId'

function getOrCreateCheckoutUserId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return stored
    }
    const id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
    return id
  } catch {
    // localStorage inaccessible — ephemeral UUID for this session
    return crypto.randomUUID()
  }
}

/** Returns a stable anonymous userId for the checkout session.
 *  Reads from / persists to `lifi.checkout.userId` in localStorage.
 *  Falls back to an ephemeral UUID per component mount if storage is unavailable. */
export function useCheckoutUserId(): string {
  const [userId] = useState(getOrCreateCheckoutUserId)
  return userId
}
