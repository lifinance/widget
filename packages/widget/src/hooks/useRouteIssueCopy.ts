import { formatUnits, parseUnits } from '@lifi/sdk'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldActions } from '../stores/form/useFieldActions.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import {
  maxRecommendedSlippage,
  minRecommendedSlippage,
} from '../stores/settings/createSettingsStore.js'
import { useSettings } from '../stores/settings/useSettings.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'
import { formatSlippage } from '../utils/format.js'
import { getQueryKey } from '../utils/queries.js'
import type {
  RouteIssue,
  RouteIssueBucket,
} from '../utils/routeIssues/types.js'
import { useApplyAmount } from './useApplyAmount.js'
import { useChain } from './useChain.js'
import { useMaxSendAmount } from './useMaxSendAmount.js'
import { useToken } from './useToken.js'

export interface RouteIssueRemedy {
  label: string
  run: () => void
}

export interface RouteIssueCopy {
  title: string
  description: string
  note?: string
}

const amountBuckets: RouteIssueBucket[] = ['amountTooLow', 'amountTooHigh']

/** Buckets that can offer an action, with or without a figure from the backend. */
export const remediableBuckets: RouteIssueBucket[] = [
  ...amountBuckets,
  'slippageTooTight',
  'temporary',
  'recipientNotSupported',
]

const buffer = {
  raise: { numerator: 102n, denominator: 100n },
  lower: { numerator: 98n, denominator: 100n },
}

/** Aimed for when the backend named no figure of its own. */
const fallbackTargetUsd = 1
const fallbackSlippage = 0.5
const suggestionDigits = 4

/**
 * A derived amount is a suggestion, not a bound, so trim it to a few
 * significant digits — away from the limit it has to clear.
 */
const roundSuggestion = (
  value: number,
  direction: 'raise' | 'lower'
): number => {
  if (!Number.isFinite(value) || value <= 0) {
    return Number.NaN
  }
  const exponent = Math.floor(Math.log10(value))
  const factor = 10 ** (suggestionDigits - 1 - exponent)
  if (!Number.isFinite(factor) || factor <= 0) {
    return value
  }
  const scaled = value * factor
  const rounded = direction === 'raise' ? Math.ceil(scaled) : Math.floor(scaled)
  return rounded / factor
}

const suggestedAmount = (issue: RouteIssue): bigint | undefined => {
  const required = issue.evidence?.requiredFromAmount
  if (required === undefined || required <= 0n) {
    return undefined
  }
  const { numerator, denominator } =
    buffer[issue.evidence?.direction ?? 'raise']
  const raw = (required * numerator) / denominator
  return raw > 0n ? raw : undefined
}

// Snap the binary error away before rounding up, or 0.0079 * 1e6 lands on
// 7900.000000000001 and ceil turns 0.79% into 0.7901%.
const slippagePercent = (issue: RouteIssue): string => {
  const required = issue.evidence?.requiredSlippage
  if (required === undefined) {
    return ''
  }
  const snapped = Number((required * 1e6).toFixed(3))
  return formatSlippage((Math.ceil(snapped) / 1e4).toString())
}

export function useRouteIssueCopy(issue: RouteIssue): RouteIssueCopy {
  const { t } = useTranslation()
  const [fromChainId, fromTokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey('from'),
    FormKeyHelper.getTokenKey('from')
  )
  const { token } = useToken(fromChainId, fromTokenAddress)
  const base = `info.routeIssue.${issue.bucket}`

  const suggested = suggestedAmount(issue)
  const values = {
    symbol: token?.symbol ?? '',
    suggested:
      suggested !== undefined && token
        ? formatUnits(suggested, token.decimals)
        : '',
    slippage: slippagePercent(issue),
    minUsd:
      issue.evidence?.minUsd !== undefined
        ? t('format.currency', { value: issue.evidence.minUsd })
        : '',
  }

  const description = (): string => {
    if (amountBuckets.includes(issue.bucket)) {
      if (values.suggested) {
        return t(`${base}.description` as any, values)
      }
      return issue.bucket === 'amountTooLow' && issue.evidence?.minUsd
        ? t(`${base}.descriptionUsd` as any, values)
        : t(`${base}.descriptionNoAmount` as any)
    }
    if (issue.bucket === 'slippageTooTight') {
      return values.slippage
        ? t(`${base}.description` as any, values)
        : t(`${base}.descriptionNoAmount` as any)
    }
    return t(`${base}.description` as any)
  }

  return {
    title: t(`${base}.title` as any),
    description: description(),
    note: issue.bucket === 'temporary' ? issue.evidence?.note : undefined,
  }
}

// Mounted only for a remediable bucket, so a static card opens no balance query.
export function useRouteIssueRemedy(
  issue: RouteIssue
): RouteIssueRemedy | undefined {
  const { t } = useTranslation()
  const { disabledUI, hiddenUI, keyPrefix } = useWidgetConfig()
  const queryClient = useQueryClient()
  const [fromChainId, fromTokenAddress, fromAmount, toChainId, toAddress] =
    useFieldValues(
      FormKeyHelper.getChainKey('from'),
      FormKeyHelper.getTokenKey('from'),
      FormKeyHelper.getAmountKey('from'),
      FormKeyHelper.getChainKey('to'),
      'toAddress'
    )
  const { token } = useToken(fromChainId, fromTokenAddress)
  const { chain: fromChain } = useChain(fromChainId)
  const { chain: toChain } = useChain(toChainId)
  const { setFieldValue } = useFieldActions()
  const applyAmount = useApplyAmount('from')
  const { setValue } = useSettingsActions()
  const { slippage } = useSettings(['slippage'])
  const maxSendAmount = useMaxSendAmount(fromChainId, fromTokenAddress)

  const base = `info.routeIssue.${issue.bucket}`

  const currentAmount = (): bigint | undefined => {
    if (!token || !fromAmount) {
      return undefined
    }
    try {
      return parseUnits(String(fromAmount), token.decimals)
    } catch {
      return undefined
    }
  }

  const toRawAmount = (
    tokens: number,
    direction: 'raise' | 'lower'
  ): bigint | undefined => {
    const rounded = roundSuggestion(tokens, direction)
    if (!token || !Number.isFinite(rounded) || rounded <= 0) {
      return undefined
    }
    try {
      const raw = parseUnits(rounded.toFixed(token.decimals), token.decimals)
      return raw > 0n ? raw : undefined
    } catch {
      return undefined
    }
  }

  /** The amount that buys `targetUsd`, when the backend named no figure. */
  const amountForUsd = (targetUsd: number): bigint | undefined => {
    const price = Number(token?.priceUSD)
    if (!token || !Number.isFinite(price) || price <= 0) {
      return undefined
    }
    return toRawAmount(targetUsd / price, 'raise')
  }

  const amountRemedy = (
    target: bigint | undefined
  ): RouteIssueRemedy | undefined => {
    if (
      target === undefined ||
      target <= 0n ||
      !token ||
      disabledUI?.fromAmount ||
      target === currentAmount()
    ) {
      return undefined
    }
    // A zero max means the balance is unknown, not empty, so it can't veto.
    if (maxSendAmount > 0n && target > maxSendAmount) {
      return undefined
    }
    // The label states the exact string `run` writes, never a rounded or
    // locale-grouped rendering of it.
    const amount = formatUnits(target, token.decimals)
    return {
      label: t(`${base}.action` as any, {
        symbol: token.symbol,
        suggested: amount,
      }),
      run: () => applyAmount(amount),
    }
  }

  const halveAmount = (): RouteIssueRemedy | undefined => {
    const current = currentAmount()
    const price = Number(token?.priceUSD)
    if (!token || !current || current <= 1n) {
      return undefined
    }
    const halved = Number(formatUnits(current / 2n, token.decimals))
    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      halved * price < fallbackTargetUsd
    ) {
      return undefined
    }
    return amountRemedy(toRawAmount(halved, 'lower'))
  }

  switch (issue.bucket) {
    case 'amountTooLow':
      return amountRemedy(
        suggestedAmount(issue) ??
          amountForUsd(issue.evidence?.minUsd ?? fallbackTargetUsd)
      )

    // No cap was reported, so halving is the first step back into range.
    case 'amountTooHigh':
      return amountRemedy(suggestedAmount(issue)) ?? halveAmount()

    case 'slippageTooTight': {
      const reported = slippagePercent(issue)
      const current = Number(slippage)
      const fallback =
        Number.isFinite(current) && current > fallbackSlippage
          ? current * 2
          : fallbackSlippage
      const target = formatSlippage(
        (reported ? Number(reported) : fallback).toString()
      )
      const value = Number(target)
      if (
        !target ||
        target === slippage ||
        value < minRecommendedSlippage ||
        value > maxRecommendedSlippage
      ) {
        return undefined
      }
      return {
        label: t(`${base}.action` as any, { slippage: target }),
        run: () => setValue('slippage', target),
      }
    }

    // Clearing the receiver only leaves a valid request when both sides share
    // an ecosystem; a cross-ecosystem transfer needs an explicit address.
    case 'recipientNotSupported':
      return toAddress &&
        !hiddenUI?.toAddress &&
        fromChain &&
        toChain &&
        fromChain.chainType === toChain.chainType
        ? {
            label: t(`${base}.action` as any),
            run: () => setFieldValue('toAddress', '', { isTouched: true }),
          }
        : undefined

    case 'temporary':
      return {
        label: t(`${base}.action` as any),
        run: () =>
          queryClient.invalidateQueries({
            queryKey: [getQueryKey('routes', keyPrefix)],
            exact: false,
          }),
      }

    default:
      return undefined
  }
}
