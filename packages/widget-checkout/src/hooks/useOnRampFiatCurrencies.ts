'use client'
import {
  FormKeyHelper,
  useFieldValues,
  useWidgetConfig,
} from '@lifi/widget/shared'
import {
  type OnrampFiatCurrenciesRequest,
  type OnrampFiatCurrenciesResponse,
  postCheckoutSession,
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

export function useOnRampFiatCurrencies(): OnRampFiatCurrenciesResult {
  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey('from'),
    FormKeyHelper.getTokenKey('from')
  )
  const { apiUrl, integrator } = useCheckoutConfig()
  const { apiKey } = useWidgetConfig()

  const enabled =
    Boolean(apiUrl) &&
    Boolean(apiKey) &&
    typeof chainId === 'number' &&
    Boolean(tokenAddress)

  const query = useQuery<OnrampFiatCurrenciesResponse, Error>({
    queryKey: ['onramp-fiat-currencies', integrator, chainId, tokenAddress],
    queryFn: async () => {
      const response = await postCheckoutSession<
        OnrampFiatCurrenciesRequest,
        OnrampFiatCurrenciesResponse
      >({
        baseUrl: apiUrl!,
        endpointPath: '/v1/checkout/onramp/fiat-currencies',
        apiKey: apiKey!,
        integrator,
        body: {
          chainId: chainId as number,
          tokenAddress: tokenAddress as string,
        },
      })
      if (!response.ok) {
        throw new Error(
          `Onramp fiat currencies request failed (${response.status})`
        )
      }
      return response.data
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
