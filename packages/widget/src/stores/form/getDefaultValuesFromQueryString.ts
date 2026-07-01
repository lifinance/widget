import { formatInputAmount } from '../../utils/format.js'
import type { DefaultValues } from './types.js'

interface GetDefaultValuesFromQueryStringOptions {
  includeToAddress?: boolean
  buildUrl?: boolean
}

export const getDefaultValuesFromQueryString = ({
  buildUrl = false,
  includeToAddress = true,
}: GetDefaultValuesFromQueryStringOptions): Partial<DefaultValues> => {
  if (typeof window === 'undefined') {
    return {}
  }

  if (!buildUrl) {
    return {}
  }

  const searchParams = Object.fromEntries(
    new URLSearchParams(window.location.search)
  )

  // Prevent using fromToken/toToken params if chain is not selected.
  ;(['from', 'to'] as const).forEach((key) => {
    if (searchParams[`${key}Token`] && !searchParams[`${key}Chain`]) {
      delete searchParams[`${key}Token`]
    }
  })

  return {
    ...(Number.isFinite(Number.parseInt(searchParams.fromChain, 10))
      ? { fromChain: Number.parseInt(searchParams.fromChain, 10) }
      : {}),
    ...(Number.isFinite(Number.parseInt(searchParams.toChain, 10))
      ? { toChain: Number.parseInt(searchParams.toChain, 10) }
      : {}),
    ...(searchParams.fromToken ? { fromToken: searchParams.fromToken } : {}),
    ...(searchParams.toToken ? { toToken: searchParams.toToken } : {}),
    ...(Number.isFinite(Number.parseFloat(searchParams.fromAmount))
      ? { fromAmount: formatInputAmount(searchParams.fromAmount) }
      : {}),
    ...(Number.isFinite(Number.parseFloat(searchParams.toAmount))
      ? { toAmount: formatInputAmount(searchParams.toAmount) }
      : {}),
    // Limit-order params (written only while on the limit tab).
    ...(Number.isFinite(Number.parseInt(searchParams.validUntil, 10))
      ? { validUntil: Number.parseInt(searchParams.validUntil, 10) }
      : {}),
    ...(searchParams.partiallyFillable === 'true' ||
    searchParams.partiallyFillable === 'false'
      ? { partiallyFillable: searchParams.partiallyFillable === 'true' }
      : {}),
    ...(includeToAddress && searchParams.toAddress
      ? { toAddress: searchParams.toAddress }
      : {}),
  }
}
