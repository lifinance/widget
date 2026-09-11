import type { Token } from '@lifi/sdk'
import { formatUnits, parseUnits } from '@lifi/sdk'
import { useQueryClient } from '@tanstack/react-query'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldActions } from '../stores/form/useFieldActions.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { maxRecommendedSlippage } from '../stores/settings/createSettingsStore.js'
import { useSettings } from '../stores/settings/useSettings.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'
import {
  formatTokenPrice,
  priceToTokenAmount,
  wrapLongWords,
} from '../utils/format.js'
import { getQueryKey } from '../utils/queries.js'
import type { Suggestion } from '../utils/routeIssues/suggestions.js'
import {
  bufferedReported,
  fallbackTargetUsd,
  gentlerSuggestion,
  nextSlippage,
  reportedSlippage,
  roundSuggestion,
} from '../utils/routeIssues/suggestions.js'
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

interface CardDeps {
  t: TFunction
  token?: Token
  slippage?: string
  amountLocked: boolean
  receiverHidden: boolean
  toAddress?: string
  sameEcosystem: boolean
  applyAmount: (value: string) => void
  applySlippage: (value: string) => void
  clearReceiver: () => void
  retry: () => void
}

const buildCard = (
  issue: RouteIssue,
  deps: CardDeps
): RouteIssueCardContent => {
  const { t, token } = deps
  const base = `info.routeIssue.${issue.bucket}`

  const toRawAmount = (
    amount: string,
    direction: 'raise' | 'lower'
  ): bigint | undefined => {
    if (!token) {
      return undefined
    }
    try {
      const raw = parseUnits(roundSuggestion(amount, direction), token.decimals)
      return raw > 0n ? raw : undefined
    } catch {
      return undefined
    }
  }

  const roundedReported = (): bigint | undefined => {
    const reported = bufferedReported(issue)
    if (!reported || !token) {
      return undefined
    }
    return toRawAmount(
      formatUnits(reported, token.decimals),
      issue.evidence?.direction ?? 'raise'
    )
  }

  const amountForUsd = (targetUsd: number): bigint | undefined =>
    toRawAmount(
      priceToTokenAmount(targetUsd.toString(), token?.priceUSD),
      'raise'
    )

  /** Halving is only a step down while what remains is still a real amount. */
  const halvedAmount = (): bigint | undefined => {
    if (!token || issue.fromAmount <= 1n) {
      return undefined
    }
    const halved = formatUnits(issue.fromAmount / 2n, token.decimals)
    return formatTokenPrice(halved, token.priceUSD) < fallbackTargetUsd
      ? undefined
      : toRawAmount(halved, 'lower')
  }

  // A contract-call quote is driven by the receive amount, so there is no send
  // amount to move and any figure would be invented.
  const suggestion = ((): Suggestion | undefined => {
    if (issue.fromAmount <= 0n) {
      return undefined
    }
    if (issue.bucket === 'amountTooHigh') {
      const reported = roundedReported() ?? halvedAmount()
      return reported === undefined ? undefined : { amount: reported }
    }
    if (issue.bucket !== 'amountTooLow') {
      return undefined
    }
    const declaredUsd = issue.evidence?.minUsd
    const target = Math.max(declaredUsd ?? 0, fallbackTargetUsd)
    return gentlerSuggestion(
      roundedReported(),
      amountForUsd(target),
      declaredUsd === undefined ? undefined : target
    )
  })()

  const amount = suggestion?.amount

  // A figure that does not move the amount is not a suggestion: the fallback
  // target can land at or under what the user already sent.
  const movesAmount =
    amount !== undefined &&
    (issue.bucket === 'amountTooLow'
      ? amount > issue.fromAmount
      : amount < issue.fromAmount)

  const suggested =
    movesAmount && token ? formatUnits(amount as bigint, token.decimals) : ''

  const reported = reportedSlippage(issue)

  const slippageTarget = ((): string => {
    // A cap is only ever the bridge's own figure; there is no sane guess for it.
    if (issue.bucket === 'slippageTooLoose') {
      return reported
    }
    // Without a reported figure and without a setting of the user's own there
    // is nothing to call too strict, and nothing meaningful to move.
    const known = reported !== '' || Number.isFinite(Number(deps.slippage))
    return issue.bucket === 'slippageTooTight' && known
      ? nextSlippage(issue, deps.slippage)
      : ''
  })()

  // Only the bar the suggestion was derived from, so the two figures agree.
  const quotedUsd =
    suggestion?.usdBar === undefined
      ? ''
      : t('format.currency', { value: suggestion.usdBar })

  const values = {
    symbol: token?.symbol ?? '',
    suggested,
    slippage: slippageTarget,
    minUsd: quotedUsd,
  }

  const description = ((): string => {
    if (issue.bucket === 'amountTooLow' || issue.bucket === 'amountTooHigh') {
      if (!suggested) {
        return t(`${base}.descriptionNoAmount` as any)
      }
      return quotedUsd
        ? t(`${base}.descriptionUsd` as any, values)
        : t(`${base}.description` as any, values)
    }
    if (issue.bucket === 'slippageTooLoose') {
      return slippageTarget
        ? t(`${base}.description` as any, values)
        : t(`${base}.descriptionNoAmount` as any)
    }
    if (issue.bucket === 'slippageTooTight') {
      if (!slippageTarget) {
        return t(`${base}.descriptionNoAmount` as any)
      }
      return reported
        ? t(`${base}.description` as any, values)
        : t(`${base}.descriptionSuggested` as any, values)
    }
    return t(`${base}.description` as any)
  })()

  const applySuggestion = t('info.routeIssue.applySuggestion')

  const action = ((): RouteIssueAction | undefined => {
    switch (issue.bucket) {
      case 'amountTooLow':
      case 'amountTooHigh':
        return !suggested || deps.amountLocked
          ? undefined
          : { label: applySuggestion, run: () => deps.applyAmount(suggested) }

      // Lowering is always within range, but only helps while the user has a
      // setting above the cap; on a resolved auto value there is nothing to set.
      case 'slippageTooLoose': {
        const applied = Number(deps.slippage)
        const target = Number(slippageTarget)
        return slippageTarget && target > 0 && target < applied
          ? {
              label: applySuggestion,
              run: () => deps.applySlippage(slippageTarget),
            }
          : undefined
      }

      case 'slippageTooTight': {
        // The widget warns about an unusual slippage rather than blocking it,
        // so offer any value that raises the current one, never one below it.
        const applied = Number(deps.slippage) || 0
        const target = Number(slippageTarget)
        const movesUp = target > applied && target <= maxRecommendedSlippage
        return slippageTarget && movesUp
          ? {
              label: applySuggestion,
              run: () => deps.applySlippage(slippageTarget),
            }
          : undefined
      }

      // Clearing the receiver only leaves a valid request when both sides share
      // an ecosystem; a cross-ecosystem transfer needs an explicit address.
      case 'recipientNotSupported':
        return deps.toAddress && !deps.receiverHidden && deps.sameEcosystem
          ? {
              label: t(`${base}.action` as any),
              run: deps.clearReceiver,
            }
          : undefined

      case 'temporary':
        return { label: t(`${base}.action` as any), run: deps.retry }

      default:
        return undefined
    }
  })()

  return {
    title: t(`${base}.title` as any),
    description,
    note:
      issue.bucket === 'temporary' && issue.evidence?.note
        ? wrapLongWords(issue.evidence.note)
        : undefined,
    action,
  }
}

export function useRouteIssueCard(
  issue: RouteIssue | undefined
): RouteIssueCardContent | undefined {
  const { t } = useTranslation()
  const { disabledUI, hiddenUI, keyPrefix } = useWidgetConfig()
  const queryClient = useQueryClient()
  const [fromChainId, fromTokenAddress, toChainId, toAddress] = useFieldValues(
    FormKeyHelper.getChainKey('from'),
    FormKeyHelper.getTokenKey('from'),
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

  const deps: CardDeps = {
    t,
    token,
    slippage,
    amountLocked: Boolean(disabledUI?.fromAmount),
    receiverHidden: Boolean(hiddenUI?.toAddress),
    toAddress,
    sameEcosystem: Boolean(
      fromChain && toChain && fromChain.chainType === toChain.chainType
    ),
    applyAmount,
    applySlippage: (value) => setValue('slippage', value),
    clearReceiver: () => setFieldValue('toAddress', '', { isTouched: true }),
    retry: () =>
      queryClient.invalidateQueries({
        queryKey: [getQueryKey('routes', keyPrefix)],
        exact: false,
      }),
  }

  return issue ? buildCard(issue, deps) : undefined
}
