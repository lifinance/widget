import { useResolvedCheckoutRecipient } from './useResolvedCheckoutRecipient.js'

/** The checkout recipient address, or `null` when none is set yet. Never the funding wallet. */
export function useCheckoutToAddress(): string | null {
  const { recipient } = useResolvedCheckoutRecipient()
  return recipient?.address ?? null
}
