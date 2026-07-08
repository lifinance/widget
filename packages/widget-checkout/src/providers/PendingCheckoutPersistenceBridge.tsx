'use client'
import {
  CheckoutContext,
  type CheckoutContextValue,
  type CheckoutResult,
  useCheckoutConfig,
} from '@lifi/widget-provider/checkout'
import { type JSX, type PropsWithChildren, useMemo } from 'react'
import { useFrozenQuote } from '../hooks/useFrozenQuote.js'
import { usePendingCheckoutWriter } from '../hooks/usePendingCheckoutWriter.js'
import { extractDepositAddress } from '../utils/extractDepositAddress.js'

export function PendingCheckoutPersistenceBridge({
  children,
}: PropsWithChildren): JSX.Element {
  const outer = useCheckoutConfig()
  const { frozen } = useFrozenQuote()
  const { writeCashSuccess } = usePendingCheckoutWriter()

  const wrappedValue = useMemo<CheckoutContextValue>(() => {
    const wrappedOnSuccess = (result: CheckoutResult): void => {
      const provider =
        result.provider === 'mesh' || result.provider === 'transak'
          ? result.provider
          : null
      const fundingSource =
        provider === 'mesh'
          ? 'exchange'
          : provider === 'transak'
            ? 'cash'
            : null
      const depositAddress =
        result.depositAddress ?? extractDepositAddress(frozen?.route)
      const fromChain = frozen?.route?.fromChainId
      if (provider && fundingSource && depositAddress && fromChain) {
        writeCashSuccess({
          depositAddress,
          fromChain,
          provider,
          fundingSource,
          frozenQuote: frozen ?? undefined,
        })
      }
      outer.onSuccess?.(result)
    }
    return {
      ...outer,
      onSuccess: wrappedOnSuccess,
    }
  }, [outer, frozen, writeCashSuccess])

  return (
    <CheckoutContext.Provider value={wrappedValue}>
      {children}
    </CheckoutContext.Provider>
  )
}
