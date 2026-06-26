import { parseUnits } from '@lifi/sdk'
import { useMemo } from 'react'
import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { useToken } from './useToken.js'

export interface LimitRouteParams {
  /** Expected receive amount in the to-token's smallest unit. */
  toAmount: string
  /** Absolute Unix timestamp (seconds) until which the order is valid. */
  validUntil: number
  partiallyFillable: boolean
}

/**
 * Builds the limit-order-specific parameters for the `advanced/routes` request
 * from the current form + limit store. The store holds `validUntil` as a
 * duration in seconds; this converts it to the absolute Unix timestamp the API
 * expects. Returns `undefined` until a valid receive amount is set.
 *
 * Consumed by the (currently inactive) limit route fetch — see
 * `services/limitOrder/getLimitOrderRoutes` and TODO(EMB-323) in `useRoutes`.
 */
export const useLimitRouteParams = (): LimitRouteParams | undefined => {
  const [
    toChainId,
    toTokenAddress,
    toAmount,
    validUntilDuration,
    partiallyFillable,
  ] = useFieldValues(
    FormKeyHelper.getChainKey('to'),
    FormKeyHelper.getTokenKey('to'),
    FormKeyHelper.getAmountKey('to'),
    'validUntil',
    'partiallyFillable'
  )
  const { token: toToken } = useToken(toChainId, toTokenAddress)

  return useMemo(() => {
    if (!toToken || !toAmount || Number(toAmount) <= 0) {
      return undefined
    }

    let parsedToAmount: string
    try {
      parsedToAmount = parseUnits(
        toAmount as string,
        toToken.decimals
      ).toString()
    } catch {
      // Intermediate input (e.g. a lone trailing dot) can't be parsed yet.
      return undefined
    }

    return {
      toAmount: parsedToAmount,
      validUntil: Math.floor(Date.now() / 1000) + validUntilDuration,
      partiallyFillable,
    }
  }, [toToken, toAmount, validUntilDuration, partiallyFillable])
}
