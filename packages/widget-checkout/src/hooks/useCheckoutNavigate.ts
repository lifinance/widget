import { useNavigate } from '@tanstack/react-router'

/**
 * Checkout runs its own TanStack Router tree while composed widget code registers the main widget
 * router on `@tanstack/react-router` `Register`. Typed `navigate({ to })` would only allow widget
 * paths; this hook widens `to` for checkout and relative targets (e.g. `'..'`).
 */
export type CheckoutNavigateFn = (
  opts: {
    to: string
  } & Record<string, unknown>
) => void

export function useCheckoutNavigate(): CheckoutNavigateFn {
  return useNavigate() as CheckoutNavigateFn
}
