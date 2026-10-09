import type { Token } from '@lifi/sdk'
import { formatUnits, parseUnits } from '@lifi/sdk'
import type { TFunction } from 'i18next'
import { maxRecommendedSlippage } from '../../stores/settings/createSettingsStore.js'
import { priceToTokenAmount, wrapLongWords } from '../format.js'
import type { Suggestion } from './suggestions.js'
import {
  bufferedReported,
  fallbackTargetUsd,
  gentlerSuggestion,
  nextSlippage,
  reportedSlippage,
  roundSuggestion,
  usdBuffer,
} from './suggestions.js'
import type { RouteIssue } from './types.js'

export interface RouteIssueAction {
  label: string
  run: () => void
  /** The answer it asks for is already on its way. */
  disabled?: boolean
}

export interface RouteIssueCardContent {
  title: string
  description: string
  note?: string
  action?: RouteIssueAction
}

export interface RouteIssueCardDeps {
  t: TFunction
  token?: Token
  slippage?: string
  amountLocked: boolean
  /**
   * Largest amount the wallet can actually send, or `undefined` where it is
   * unknown — no wallet, no balance yet. A suggestion above it cannot be
   * applied, and an empty wallet (`0n`) can apply none.
   */
  spendable?: bigint
  receiverHidden: boolean
  /** The widget cannot execute without one, so clearing it is not a fix. */
  receiverRequired: boolean
  toAddress?: string
  sameEcosystem: boolean
  /** The settings hide slippage, so a value set here could not be seen or undone. */
  slippageHidden?: boolean
  /** A quote for this request is already running. */
  isFetching?: boolean
  applyAmount: (value: string) => void
  applySlippage: (value: string) => void
  clearReceiver: () => void
  retry: () => void
}

// The step each destination reason names, so the card can say what to do.
const destinationSteps: Record<string, string> = {
  stellarUnfunded: 'descriptionStellarUnfunded',
  stellarTrustline: 'descriptionStellarTrustline',
  stellarReserve: 'descriptionStellarReserve',
  lighterAccount: 'descriptionLighterAccount',
  seiLink: 'descriptionSeiLink',
  solAccountRent: 'descriptionSolAccountRent',
}

export const buildRouteIssueCard = (
  issue: RouteIssue,
  deps: RouteIssueCardDeps
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

  // Moved clear of the bar as a reported figure is: landing on it exactly
  // asked for an amount the tool could still refuse.
  const amountForUsd = (
    targetUsd: number,
    direction: 'raise' | 'lower' = 'raise'
  ): bigint | undefined =>
    toRawAmount(
      priceToTokenAmount(
        (targetUsd * usdBuffer[direction]).toString(),
        token?.priceUSD
      ),
      direction
    )

  // A contract-call quote is driven by the receive amount, so there is no send
  // amount to move and any figure would be invented.
  const suggestion = ((): Suggestion | undefined => {
    if (issue.fromAmount <= 0n) {
      return undefined
    }
    if (issue.bucket === 'amountTooHigh') {
      // Only a maximum the backend actually named. Halving what the user sent
      // was measured against the live API: where a figure was reported the
      // suggestion worked, and where it was invented the amount was still
      // refused — so the card offered a fresh halving, and then another.
      const reported = roundedReported()
      // A ceiling stated in dollars converts to tokens at the current price, so
      // carry the bar and let the card quote what was actually said.
      const maxUsd = issue.evidence?.maxUsd
      const forUsd =
        maxUsd === undefined ? undefined : amountForUsd(maxUsd, 'lower')
      // A reported cap is always below what the user sent, because a tool
      // refused that amount. A converted one is not: it is priced with the
      // widget's own rate and can land at or above it, which would leave the
      // card with no suggestion at all. Clearing one tool's cap is enough, so
      // aim for the highest figure that still moves the amount down.
      const usable = (value: bigint | undefined): bigint | undefined =>
        value !== undefined && value < issue.fromAmount ? value : undefined
      const reportedBelow = usable(reported)
      const forUsdBelow = usable(forUsd)
      if (
        forUsdBelow !== undefined &&
        (reportedBelow === undefined || forUsdBelow > reportedBelow)
      ) {
        return { amount: forUsdBelow, usdBar: maxUsd }
      }
      return reportedBelow === undefined ? undefined : { amount: reportedBelow }
    }
    if (issue.bucket !== 'amountTooLow') {
      return undefined
    }
    const declaredUsd = issue.evidence?.minUsd
    const target = Math.max(declaredUsd ?? 0, fallbackTargetUsd)
    // The bar still decides which amount is gentler — a tool asking for less
    // than the floor is still a tool the user can reach. Whether the figure may
    // be quoted is a separate question, settled by `quotableBar` below.
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

  // The raw figure drives the field write, so it must stay parseable. Only the
  // sentence gets grouped, or `parseUnits` would choke on the separators.
  const suggested =
    movesAmount && token ? formatUnits(amount as bigint, token.decimals) : ''
  const suggestedDisplay = suggested
    ? t('format.tokenAmount', { value: suggested })
    : ''

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

  // A bar under the floor was raised to it, so the figure the suggestion clears
  // is the widget's own. Naming it would put words in the tool's mouth.
  const declaredMinUsd = issue.evidence?.minUsd
  const quotableBar =
    issue.bucket !== 'amountTooLow' ||
    (declaredMinUsd !== undefined && declaredMinUsd >= fallbackTargetUsd)

  // Only the bar the suggestion was derived from, so the two figures agree.
  const quotedUsd =
    suggestion?.usdBar === undefined || !quotableBar
      ? ''
      : t('format.currency', { value: suggestion.usdBar })

  const values = {
    symbol: token?.symbol ?? '',
    suggested: suggestedDisplay,
    slippage: slippageTarget,
    // The same figure under both names, so each card's copy can read naturally.
    minUsd: quotedUsd,
    maxUsd: quotedUsd,
  }

  // Clearing the receiver only leaves a valid request when both sides share
  // an ecosystem; a cross-ecosystem transfer needs an explicit address.
  const canClearReceiver =
    Boolean(deps.toAddress) &&
    !deps.receiverHidden &&
    !deps.receiverRequired &&
    deps.sameEcosystem

  // A figure the user cannot apply is still worth reading, but the sentence
  // must not ask for a change the app has locked.
  const unaffordable =
    amount !== undefined &&
    deps.spendable !== undefined &&
    amount > deps.spendable

  const description = ((): string => {
    if (issue.bucket === 'amountTooLow' || issue.bucket === 'amountTooHigh') {
      if (deps.amountLocked) {
        return t(`${base}.descriptionLocked` as any)
      }
      if (!suggested) {
        return t(`${base}.descriptionNoAmount` as any)
      }
      if (quotedUsd) {
        return t(`${base}.descriptionUsd` as any, values)
      }
      // Without a reported figure or a stated bar the number is the invented
      // floor, so the copy must advise rather than report an observed minimum.
      // `evidence.estimated` marks a requiredFromAmount the widget scaled from
      // a USD ratio rather than one a tool stated, so a suggestion taken from
      // it is no more observed than the floor is.
      const scaledReport =
        Boolean(issue.evidence?.estimated) &&
        suggestion?.usdBar === undefined &&
        !suggestion?.estimated
      const invented =
        suggestion?.estimated ||
        scaledReport ||
        (suggestion?.usdBar !== undefined && !quotableBar)
      return invented && issue.bucket === 'amountTooLow'
        ? t(`${base}.descriptionEstimated` as any, values)
        : t(`${base}.description` as any, values)
    }
    if (
      (issue.bucket === 'slippageTooLoose' ||
        issue.bucket === 'slippageTooTight') &&
      deps.slippageHidden
    ) {
      return t(`${base}.descriptionHidden` as any)
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
    if (issue.bucket === 'recipientNotSupported' && !canClearReceiver) {
      return t(`${base}.descriptionNoAction` as any)
    }
    if (
      issue.bucket === 'temporary' &&
      issue.ruleId === 'gasCostsExceedLimit'
    ) {
      return t(`${base}.descriptionGas` as any)
    }
    if (issue.bucket === 'destinationAccountNotReady') {
      const step = destinationSteps[issue.ruleId]
      if (step) {
        return t(`${base}.${step}` as any)
      }
    }
    return t(`${base}.description` as any)
  })()

  const setSlippage = (): RouteIssueAction => ({
    label: t('info.routeIssue.setSlippage', { slippage: slippageTarget }),
    run: () => deps.applySlippage(slippageTarget),
  })

  const action = ((): RouteIssueAction | undefined => {
    switch (issue.bucket) {
      case 'amountTooLow':
      case 'amountTooHigh':
        // Every other fix here withdraws when it cannot help. Raising past the
        // balance only swaps "no routes" for "insufficient funds", so the
        // figure stays on screen and the button does not.
        return !suggested || deps.amountLocked || unaffordable
          ? undefined
          : {
              label: t('info.routeIssue.useAmount', {
                suggested: suggestedDisplay,
                symbol: values.symbol,
              }),
              run: () => deps.applyAmount(suggested),
            }

      // Lowering is always within range, but only helps while the user has a
      // setting above the cap; on a resolved auto value there is nothing to set.
      case 'slippageTooLoose': {
        const applied = Number(deps.slippage)
        const target = Number(slippageTarget)
        return slippageTarget &&
          !deps.slippageHidden &&
          target > 0 &&
          target < applied
          ? setSlippage()
          : undefined
      }

      case 'slippageTooTight': {
        // Only ever upward, and only within the band the widget itself calls
        // reasonable: a bridge asking for more than that is stated in the copy
        // but never applied in one click, because agreeing to lose several
        // percent is a decision to take in settings rather than on a card.
        const applied = Number(deps.slippage) || 0
        const target = Number(slippageTarget)
        const movesUp = target > applied && target <= maxRecommendedSlippage
        return slippageTarget && movesUp && !deps.slippageHidden
          ? setSlippage()
          : undefined
      }

      case 'recipientNotSupported':
        return canClearReceiver
          ? {
              label: t(`${base}.action` as any),
              run: deps.clearReceiver,
            }
          : undefined

      case 'temporary':
        return deps.isFetching
          ? { label: t(`${base}.busy` as any), run: deps.retry, disabled: true }
          : { label: t(`${base}.action` as any), run: deps.retry }

      default:
        return undefined
    }
  })()

  const note = ((): string | undefined => {
    if (issue.bucket === 'temporary' && issue.evidence?.note) {
      return wrapLongWords(issue.evidence.note)
    }
    if (suggested && unaffordable && !deps.amountLocked) {
      return t('info.routeIssue.unaffordable')
    }
    return undefined
  })()

  return {
    title: t(`${base}.title` as any),
    description,
    note,
    action,
  }
}
