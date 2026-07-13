import { useCheckoutFlowStore } from '../stores/useCheckoutFlowStore.js'

// `wallet` is the only funding source that draws from the connected wallet's
// balance. `transfer`, `exchange`, and `cash` get funds elsewhere — so wallet
// balance fetches, MAX shortcuts, and insufficient-funds warnings don't apply.
export const useIsWalletFundedFlow = (): boolean =>
  useCheckoutFlowStore((s) => (s.fundingSource ?? 'wallet') === 'wallet')
