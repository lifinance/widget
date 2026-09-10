import { formatUnits } from '@lifi/sdk'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import {
  maxRecommendedSlippage,
  minRecommendedSlippage,
} from '../stores/settings/createSettingsStore.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'
import { formatSlippage } from '../utils/format.js'
import type {
  RouteIssue,
  RouteIssueBucket,
} from '../utils/routeIssues/types.js'
import { useApplyAmount } from './useApplyAmount.js'
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

/** Buckets whose rules can produce evidence the widget knows how to act on. */
export const remediableBuckets: RouteIssueBucket[] = [
  ...amountBuckets,
  'slippageTooTight',
]

const buffer = {
  raise: { numerator: 102n, denominator: 100n },
  lower: { numerator: 98n, denominator: 100n },
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
  const { disabledUI } = useWidgetConfig()
  const [fromChainId, fromTokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey('from'),
    FormKeyHelper.getTokenKey('from')
  )
  const { token } = useToken(fromChainId, fromTokenAddress)
  const applyAmount = useApplyAmount('from')
  const { setValue } = useSettingsActions()
  const maxSendAmount = useMaxSendAmount(fromChainId, fromTokenAddress)

  const base = `info.routeIssue.${issue.bucket}`

  if (amountBuckets.includes(issue.bucket)) {
    const suggested = suggestedAmount(issue)
    if (suggested === undefined || !token || disabledUI?.fromAmount) {
      return undefined
    }
    // A zero max means the balance is unknown, not empty, so it can't veto.
    if (
      issue.bucket === 'amountTooLow' &&
      maxSendAmount > 0n &&
      suggested > maxSendAmount
    ) {
      return undefined
    }
    // The label states the exact string `run` writes, never a rounded or
    // locale-grouped rendering of it.
    const amount = formatUnits(suggested, token.decimals)
    return {
      label: t(`${base}.action` as any, {
        symbol: token.symbol,
        suggested: amount,
      }),
      run: () => applyAmount(amount),
    }
  }

  if (issue.bucket === 'slippageTooTight') {
    const slippage = slippagePercent(issue)
    const value = Number(slippage)
    if (
      !slippage ||
      value < minRecommendedSlippage ||
      value > maxRecommendedSlippage
    ) {
      return undefined
    }
    return {
      label: t(`${base}.action` as any, { slippage }),
      run: () => setValue('slippage', slippage),
    }
  }

  return undefined
}
