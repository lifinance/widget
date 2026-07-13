import type { ChainType } from '@lifi/sdk'
import { useChain, useWidgetConfig } from '@lifi/widget/shared'
import { useCheckoutConfig } from '@lifi/widget-provider/checkout'
import { useCallback, useMemo } from 'react'
import {
  type CheckoutRecipient,
  useCheckoutRecipientStore,
} from '../stores/useCheckoutRecipientStore.js'

export interface ResolvedCheckoutRecipient {
  /** The resolved recipient — integrator `config.toAddress` wins, else the user-set one. */
  recipient: { address: string; chainType?: ChainType } | null
  /** Whether the integrator omitted `toAddress` and lets the user set it. */
  isUserSettable: boolean
  /** True once a user-set recipient exists (vs. integrator-configured). */
  isUserSet: boolean
  setUserRecipient: (recipient: CheckoutRecipient) => void
  clearUserRecipient: () => void
}

export function useResolvedCheckoutRecipient(): ResolvedCheckoutRecipient {
  const { toAddress, toChain } = useWidgetConfig()
  const { chain: destinationChain } = useChain(toChain)
  const { integrator, allowUserDestinationAddress } = useCheckoutConfig()
  const userRecipient = useCheckoutRecipientStore(
    (s) => s.recipients[integrator] ?? null
  )

  // Drop a persisted recipient that no longer matches the destination ecosystem.
  const validUserRecipient = useMemo(() => {
    if (!userRecipient) {
      return null
    }
    if (
      destinationChain &&
      userRecipient.chainType !== destinationChain.chainType
    ) {
      return null
    }
    return userRecipient
  }, [userRecipient, destinationChain])
  const setRecipient = useCheckoutRecipientStore((s) => s.setRecipient)
  const clearRecipient = useCheckoutRecipientStore((s) => s.clearRecipient)

  const configRecipient = useMemo(() => {
    if (!toAddress) {
      return null
    }
    return typeof toAddress === 'string'
      ? { address: toAddress }
      : { address: toAddress.address, chainType: toAddress.chainType }
  }, [toAddress])

  const setUserRecipient = useCallback(
    (recipient: CheckoutRecipient) => setRecipient(integrator, recipient),
    [setRecipient, integrator]
  )
  const clearUserRecipient = useCallback(
    () => clearRecipient(integrator),
    [clearRecipient, integrator]
  )

  return {
    recipient: configRecipient ?? validUserRecipient,
    isUserSettable: Boolean(allowUserDestinationAddress) && !configRecipient,
    isUserSet: !configRecipient && Boolean(validUserRecipient),
    setUserRecipient,
    clearUserRecipient,
  }
}
