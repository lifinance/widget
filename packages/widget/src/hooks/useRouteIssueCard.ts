import { formatUnits, parseUnits } from '@lifi/sdk'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldActions } from '../stores/form/useFieldActions.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { useSettings } from '../stores/settings/useSettings.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'
import { formatSlippage } from '../utils/format.js'
import { getQueryKey } from '../utils/queries.js'
import type { RouteIssue } from '../utils/routeIssues/types.js'
import { useApplyAmount } from './useApplyAmount.js'
import { useChain } from './useChain.js'
import { useToken } from './useToken.js'

export interface RouteIssueAction {
  label: string
  run: () => void
}

export interface RouteIssueCardContent {
  title: string
  description: string
  note?: string
  action?: RouteIssueAction
}

const buffer = {
  raise: { numerator: 102n, denominator: 100n },
  lower: { numerator: 98n, denominator: 100n },
}

/** Aimed for when the backend named no figure of its own. */
const fallbackTargetUsd = 1
const fallbackSlippage = 0.5
const suggestionDigits = 2

/**
 * A suggestion should read as a round number, so trim it to two significant
 * digits — away from the limit it has to clear, which also clears it.
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

const reportedAmount = (issue: RouteIssue): bigint | undefined => {
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
const reportedSlippage = (issue: RouteIssue): string => {
  const required = issue.evidence?.requiredSlippage
  if (required === undefined) {
    return ''
  }
  const snapped = Number((required * 1e6).toFixed(3))
  return formatSlippage((Math.ceil(snapped) / 1e4).toString())
}

export function useRouteIssueCard(issue: RouteIssue): RouteIssueCardContent {
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
    return toRawAmount(Math.max(targetUsd, fallbackTargetUsd) / price, 'raise')
  }

  /** Halving is only a step down while what remains is still a real amount. */
  const halvedAmount = (): bigint | undefined => {
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
    return toRawAmount(halved, 'lower')
  }

  /** The backend figure, rounded like every other suggestion. */
  const roundedReported = (): bigint | undefined => {
    const reported = reportedAmount(issue)
    if (reported === undefined || !token) {
      return undefined
    }
    return toRawAmount(
      Number(formatUnits(reported, token.decimals)),
      issue.evidence?.direction ?? 'raise'
    )
  }

  const targetAmount = (): bigint | undefined => {
    if (issue.bucket === 'amountTooLow') {
      return (
        roundedReported() ??
        amountForUsd(issue.evidence?.minUsd ?? fallbackTargetUsd)
      )
    }
    if (issue.bucket === 'amountTooHigh') {
      return roundedReported() ?? halvedAmount()
    }
    return undefined
  }

  const targetSlippage = (): string => {
    if (issue.bucket !== 'slippageTooTight') {
      return ''
    }
    const reported = reportedSlippage(issue)
    if (reported) {
      return reported
    }
    const applied = Number(slippage)
    return formatSlippage(
      (Number.isFinite(applied) && applied > fallbackSlippage
        ? applied * 2
        : fallbackSlippage
      ).toString()
    )
  }

  const amount = targetAmount()
  const suggested =
    amount !== undefined && token ? formatUnits(amount, token.decimals) : ''
  const slippageTarget = targetSlippage()

  const values = {
    symbol: token?.symbol ?? '',
    suggested,
    slippage: slippageTarget,
    minUsd:
      issue.evidence?.minUsd !== undefined
        ? t('format.currency', { value: issue.evidence.minUsd })
        : '',
  }

  const description = (): string => {
    if (issue.bucket === 'amountTooLow' || issue.bucket === 'amountTooHigh') {
      if (!suggested) {
        return t(`${base}.descriptionNoAmount` as any)
      }
      return issue.bucket === 'amountTooLow' && issue.evidence?.minUsd
        ? t(`${base}.descriptionUsd` as any, values)
        : t(`${base}.description` as any, values)
    }
    if (issue.bucket === 'slippageTooTight') {
      if (!slippageTarget) {
        return t(`${base}.descriptionNoAmount` as any)
      }
      return reportedSlippage(issue)
        ? t(`${base}.description` as any, values)
        : t(`${base}.descriptionSuggested` as any, values)
    }
    return t(`${base}.description` as any)
  }

  const action = (): RouteIssueAction | undefined => {
    switch (issue.bucket) {
      case 'amountTooLow':
      case 'amountTooHigh':
        return !suggested ||
          disabledUI?.fromAmount ||
          amount === currentAmount()
          ? undefined
          : {
              label: t('info.routeIssue.applySuggestion'),
              run: () => applyAmount(suggested),
            }

      case 'slippageTooTight': {
        // The widget warns about an unusual slippage rather than blocking it,
        // so offer any value that raises the current one, never one below it.
        const applied = Number(slippage)
        return !slippageTarget ||
          Number(slippageTarget) <= (Number.isFinite(applied) ? applied : 0)
          ? undefined
          : {
              label: t('info.routeIssue.applySuggestion'),
              run: () => setValue('slippage', slippageTarget),
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

  return {
    title: t(`${base}.title` as any),
    description: description(),
    note: issue.bucket === 'temporary' ? issue.evidence?.note : undefined,
    action: action(),
  }
}
