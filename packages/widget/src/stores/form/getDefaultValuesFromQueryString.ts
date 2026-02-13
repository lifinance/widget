import { formatInputAmount } from '../../utils/format.js'
import type { DefaultValues } from './types.js'

interface GetDefaultValuesFromQueryStringOptions {
  includeToAddress?: boolean
}

export const getDefaultValuesFromQueryString = ({
  includeToAddress = true,
}: GetDefaultValuesFromQueryStringOptions = {}): Partial<DefaultValues> => {
  if (typeof window === 'undefined') {
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
    ...(includeToAddress && searchParams.toAddress
      ? { toAddress: searchParams.toAddress }
      : {}),
  }
}
