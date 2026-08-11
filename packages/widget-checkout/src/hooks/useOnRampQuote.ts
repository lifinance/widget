'use client'
import {
  getOnrampQuote,
  type OnrampQuoteResult as SdkOnrampQuoteResult,
} from '@lifi/sdk'
import {
  FormKeyHelper,
  useDebouncedWatch,
  useFieldValues,
  useSDKClient,
} from '@lifi/widget/shared'
import { useCheckoutConfig } from '@lifi/widget-provider/checkout'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useFiatCurrencyStore } from '../stores/useFiatCurrencyStore.js'
import { normalizeFiatAmount } from '../utils/fiatFormat.js'

export interface OnRampQuoteResult {
  data: SdkOnrampQuoteResult | undefined
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
  const { integrator } = useCheckoutConfig()
  const sdkClient = useSDKClient()
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
    typeof chainId === 'number' &&
    Boolean(tokenAddress) &&
    Boolean(fiatCurrency)

  const query = useQuery<SdkOnrampQuoteResult, Error>({
    queryKey: [
      'onramp-quote',
      integrator,
      chainId,
      tokenAddress,
      fiatCurrency,
      debouncedFiatAmount,
      paymentMethod,
    ],
    queryFn: () =>
      getOnrampQuote(sdkClient, {
        tokenAddress: tokenAddress as string,
        chainId: chainId as number,
        fiatAmount: debouncedFiatAmount,
        fiatCurrency,
        ...(paymentMethod ? { paymentMethod } : {}),
      }),
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
