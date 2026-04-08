import { formatUnits, type RouteExtended } from '@lifi/sdk'
import type { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'

interface TokenRateState {
  isForward: boolean
  toggleIsForward(): void
}

const useTokenRateStore = create<TokenRateState>((set) => ({
  isForward: true,
  toggleIsForward: () => set((state) => ({ isForward: !state.isForward })),
}))

export function useTokenRateText(route: RouteExtended): {
  rateText: string
  toggleRate: MouseEventHandler
} {
  const { t } = useTranslation()
  const { isForward, toggleIsForward } = useTokenRateStore()

  const lastStep = route.steps.at(-1)

  const fromToken = {
    ...route.fromToken,
    amount: BigInt(route.fromAmount),
  }
  const toToken = {
    ...(lastStep?.execution?.toToken ??
      lastStep?.action.toToken ??
      route.toToken),
    amount: lastStep?.execution?.toAmount
      ? BigInt(lastStep.execution.toAmount)
      : BigInt(route.toAmount),
  }

  const fromToRate =
    Number.parseFloat(formatUnits(toToken.amount!, toToken.decimals)) /
    Number.parseFloat(formatUnits(fromToken.amount!, fromToken.decimals))
  const toFromRate =
    Number.parseFloat(formatUnits(fromToken.amount!, fromToken.decimals)) /
    Number.parseFloat(formatUnits(toToken.amount!, toToken.decimals))

  const rateText = isForward
    ? `1 ${fromToken.symbol} ≈ ${t('format.tokenAmount', { value: fromToRate })} ${toToken.symbol}`
    : `1 ${toToken.symbol} ≈ ${t('format.tokenAmount', { value: toFromRate })} ${fromToken.symbol}`

  const toggleRate: MouseEventHandler = (e) => {
    e.stopPropagation()
    toggleIsForward()
  }

  return { rateText: rateText, toggleRate: toggleRate }
}
