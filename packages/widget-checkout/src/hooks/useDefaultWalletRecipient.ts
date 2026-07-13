'use client'
import { useAccount } from '@lifi/wallet-management'
import { useChain, useWidgetConfig } from '@lifi/widget/shared'
import { useEffect, useRef } from 'react'
import { useCheckoutFlowStore } from '../stores/useCheckoutFlowStore.js'
import { useResolvedCheckoutRecipient } from './useResolvedCheckoutRecipient.js'

// In the wallet flow the user pays from (and receives into) their own wallet, so
// default the destination to the connected account that matches the destination
// ecosystem. Seeds once and only when the integrator left the recipient
// user-settable and the user hasn't set one — the card stays editable, and a
// cross-ecosystem destination (no matching account) falls back to the manual
// "where to send it" prompt.
export function useDefaultWalletRecipient(): void {
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const { toChain } = useWidgetConfig()
  const { chain: destinationChain } = useChain(toChain)
  const { isUserSettable, isUserSet, setUserRecipient } =
    useResolvedCheckoutRecipient()
  const { accounts } = useAccount()
  const seededRef = useRef(false)

  useEffect(() => {
    if (
      seededRef.current ||
      fundingSource !== 'wallet' ||
      !isUserSettable ||
      isUserSet ||
      !destinationChain
    ) {
      return
    }
    const match = accounts.find(
      (a) =>
        a.isConnected && a.address && a.chainType === destinationChain.chainType
    )
    if (match?.address) {
      seededRef.current = true
      setUserRecipient({
        address: match.address,
        chainType: destinationChain.chainType,
      })
    }
  }, [
    fundingSource,
    isUserSettable,
    isUserSet,
    destinationChain,
    accounts,
    setUserRecipient,
  ])
}
