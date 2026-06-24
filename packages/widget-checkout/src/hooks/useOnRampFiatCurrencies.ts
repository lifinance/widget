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

// The endpoint returns the raw on-ramp provider shape (`fiatCurrencies` keyed
// by `symbol`); normalize to the widget contract here. Prefers `currencies` so
// it keeps working if the backend starts returning the normalized shape.
interface RawOnrampPaymentOption {
  id: string
  name?: string
  isActive?: boolean
}

interface RawOnrampFiatCurrency {
  currency?: string
  symbol?: string
  paymentOptions?: RawOnrampPaymentOption[]
  isAllowed?: boolean
}

interface RawOnrampFiatCurrenciesResponse {
  defaultCurrency?: string
  currencies?: RawOnrampFiatCurrency[]
  fiatCurrencies?: RawOnrampFiatCurrency[]
}

function normalizeFiatCurrencies(
  raw: RawOnrampFiatCurrenciesResponse
): OnrampFiatCurrenciesResponse {
  const list = raw.currencies ?? raw.fiatCurrencies ?? []
  return {
    defaultCurrency: raw.defaultCurrency,
    currencies: list
      .filter((item) => item.isAllowed !== false)
      .map((item) => ({
        currency: item.currency ?? item.symbol ?? '',
        paymentOptions: (item.paymentOptions ?? [])
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
        RawOnrampFiatCurrenciesResponse
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
      return normalizeFiatCurrencies(response.data)
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
