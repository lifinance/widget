'use client'
import {
  FormKeyHelper,
  useDebouncedWatch,
  useFieldValues,
  useWidgetConfig,
} from '@lifi/widget/shared'
import {
  type OnrampQuoteRequest,
  type OnrampQuoteResponse,
  postCheckoutSession,
  useCheckoutConfig,
} from '@lifi/widget-provider/checkout'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useFiatCurrencyStore } from '../stores/useFiatCurrencyStore.js'
import { normalizeFiatAmount } from '../utils/fiatFormat.js'

export interface OnRampQuoteResult {
  data: OnrampQuoteResponse | undefined
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  isReady: boolean
  isDebouncePending: boolean
  error: Error | null
  debouncedFiatAmount: string
  refetch: () => void
}

export function useOnRampQuote(): OnRampQuoteResult {
  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey('from'),
    FormKeyHelper.getTokenKey('from')
  )
  const [cashFiatAmount] = useFieldValues('cashFiatAmount')
  const [debouncedCashFiatAmount] = useDebouncedWatch(350, 'cashFiatAmount')
  const { apiUrl, integrator } = useCheckoutConfig()
  const { apiKey } = useWidgetConfig()
  const fiatCurrency = useFiatCurrencyStore((s) => s.currency)
  const paymentMethod = useFiatCurrencyStore((s) => s.paymentMethod)

  const normalizedCashFiatAmount = normalizeFiatAmount(cashFiatAmount)
  const debouncedFiatAmount = normalizeFiatAmount(debouncedCashFiatAmount)
  const parsedTypedAmount = Number.parseFloat(normalizedCashFiatAmount)
  const parsedAmount = Number.parseFloat(debouncedFiatAmount)
  const hasCurrentAmount =
    Number.isFinite(parsedTypedAmount) && parsedTypedAmount > 0
  const hasValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0
  const enabled =
    hasCurrentAmount &&
    hasValidAmount &&
    Boolean(apiUrl) &&
    Boolean(apiKey) &&
    typeof chainId === 'number' &&
    Boolean(tokenAddress) &&
    Boolean(fiatCurrency)

  const query = useQuery<OnrampQuoteResponse, Error>({
    queryKey: [
      'onramp-quote',
      integrator,
      chainId,
      tokenAddress,
      fiatCurrency,
      debouncedFiatAmount,
      paymentMethod,
    ],
    queryFn: async () => {
      const response = await postCheckoutSession<
        OnrampQuoteRequest,
        OnrampQuoteResponse
      >({
        baseUrl: apiUrl!,
        endpointPath: '/v1/checkout/onramp/quote',
        apiKey: apiKey!,
        integrator,
        body: {
          chainId: chainId as number,
          tokenAddress: tokenAddress as string,
          fiatCurrency,
          fiatAmount: debouncedFiatAmount,
          ...(paymentMethod ? { paymentMethod } : {}),
        },
      })
      if (!response.ok) {
        throw new Error(`Onramp quote request failed (${response.status})`)
      }
      return response.data
    },
    enabled,
    staleTime: 0,
    placeholderData: keepPreviousData,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    isReady: Boolean(query.data) && !query.isFetching && !query.isError,
    isDebouncePending: normalizedCashFiatAmount !== debouncedFiatAmount,
    error: query.error,
    debouncedFiatAmount,
    refetch: () => {
      void query.refetch()
    },
  }
}
