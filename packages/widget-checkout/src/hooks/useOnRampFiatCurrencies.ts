'use client'
import {
  getOnrampFiatCurrencies,
  type OnrampFiatCurrenciesResult as SdkOnrampFiatCurrenciesResult,
} from '@lifi/sdk'
import {
  FormKeyHelper,
  useFieldValues,
  useSDKClient,
} from '@lifi/widget/shared'
import {
  type OnrampFiatCurrenciesResponse,
  useCheckoutConfig,
} from '@lifi/widget-provider/checkout'
import { useQuery } from '@tanstack/react-query'

export interface OnRampFiatCurrenciesResult {
  data: OnrampFiatCurrenciesResponse | undefined
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

// The SDK returns its raw on-ramp provider shape (`fiatCurrencies` keyed by
// `symbol`); normalize to the widget contract here.
export function normalizeFiatCurrencies(
  raw: SdkOnrampFiatCurrenciesResult
): OnrampFiatCurrenciesResponse {
  return {
    defaultCurrency: raw.defaultCurrency,
    currencies: raw.fiatCurrencies
      .filter((item) => item.isAllowed !== false)
      .map((item) => ({
        currency: item.symbol,
        paymentOptions: item.paymentOptions
          .filter((option) => option.isActive !== false)
          .map((option) => ({ id: option.id, name: option.name })),
      }))
      .filter((item) => item.currency),
  }
}

export function useOnRampFiatCurrencies(): OnRampFiatCurrenciesResult {
  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey('from'),
    FormKeyHelper.getTokenKey('from')
  )
  const { integrator } = useCheckoutConfig()
  const sdkClient = useSDKClient()

  const enabled = typeof chainId === 'number' && Boolean(tokenAddress)

  const query = useQuery<OnrampFiatCurrenciesResponse, Error>({
    queryKey: ['onramp-fiat-currencies', integrator, chainId, tokenAddress],
    queryFn: async () => {
      const result = await getOnrampFiatCurrencies(sdkClient, {
        tokenAddress: tokenAddress as string,
        chainId: chainId as number,
      })
      return normalizeFiatCurrencies(result)
    },
    enabled,
    staleTime: 24 * 60 * 60 * 1000,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      void query.refetch()
    },
  }
}
