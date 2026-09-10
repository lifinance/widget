import { formatUnits } from '@lifi/sdk'
import { useCallback, useMemo } from 'react'
import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldActions } from '../stores/form/useFieldActions.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { useSettings } from '../stores/settings/useSettings.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'
import type { RouteIssue } from '../utils/routeIssues/types.js'
import { useMaxSendAmount } from './useMaxSendAmount.js'
import { useToken } from './useToken.js'

export interface RouteIssueRemedy {
  labelKey: string
  values: Record<string, string>
  run: () => void
}

export interface RouteIssueCopy {
  titleKey: string
  descriptionKey: string
  values: Record<string, string>
  note?: string
  remedy?: RouteIssueRemedy
}

const buffer = {
  raise: { numerator: 102n, denominator: 100n },
  lower: { numerator: 98n, denominator: 100n },
}

export function useRouteIssueCopy(issue: RouteIssue): RouteIssueCopy {
  const [fromChainId, fromTokenAddress, fromAmount] = useFieldValues(
    FormKeyHelper.getChainKey('from'),
    FormKeyHelper.getTokenKey('from'),
    FormKeyHelper.getAmountKey('from')
  )
  const { token } = useToken(fromChainId, fromTokenAddress)
  const { setFieldValue } = useFieldActions()
  const { setValue, toggleToolKeys } = useSettingsActions()
  const { disabledBridges, disabledExchanges } = useSettings([
    'disabledBridges',
    'disabledExchanges',
  ])
  const maxSendAmount = useMaxSendAmount(fromChainId, fromTokenAddress)

  const suggested = useMemo(() => {
    const bounds = issue.evidence?.amountBounds
    if (!bounds || !token || !fromAmount) {
      return undefined
    }
    let current: bigint
    try {
      const [whole, fraction = ''] = String(fromAmount).split('.')
      const padded = `${whole}${fraction.padEnd(token.decimals, '0').slice(0, token.decimals)}`
      current = BigInt(padded)
    } catch {
      return undefined
    }
    if (current <= 0n || bounds.current <= 0n) {
      return undefined
    }
    const { numerator, denominator } =
      buffer[issue.evidence?.direction ?? 'raise']
    const raw =
      (current * bounds.required * numerator) / (bounds.current * denominator)
    return raw > 0n ? raw : undefined
  }, [
    issue.evidence?.amountBounds,
    issue.evidence?.direction,
    token,
    fromAmount,
  ])

  // One value drives both the label and the write, so the card can never
  // promise an amount different from the one it applies.
  const suggestedLabel =
    suggested !== undefined && token
      ? formatUnits(suggested, token.decimals)
      : ''

  const applyAmount = useCallback(() => {
    if (!suggestedLabel) {
      return
    }
    setFieldValue(FormKeyHelper.getAmountKey('from'), suggestedLabel, {
      isDirty: true,
      isTouched: true,
    })
  }, [suggestedLabel, setFieldValue])

  const applySlippage = useCallback(() => {
    const required = issue.evidence?.requiredSlippage
    if (required === undefined) {
      return
    }
    setValue('slippage', (required * 100).toString())
  }, [issue.evidence?.requiredSlippage, setValue])

  // `disabledBridges` is derived from `_enabledBridges`; writing it directly
  // would be overwritten by the next toggle. `toggleToolKeys` flips a set of
  // keys to enabled when they are not all enabled already.
  const resetTools = useCallback(() => {
    if (disabledBridges.length) {
      toggleToolKeys('Bridges', disabledBridges)
    }
    if (disabledExchanges.length) {
      toggleToolKeys('Exchanges', disabledExchanges)
    }
  }, [disabledBridges, disabledExchanges, toggleToolKeys])

  const values: Record<string, string> = {
    symbol: token?.symbol ?? '',
    current: String(fromAmount ?? ''),
    suggested: suggestedLabel,
    slippage:
      issue.evidence?.requiredSlippage !== undefined
        ? (issue.evidence.requiredSlippage * 100).toString()
        : '',
    minUsd:
      issue.evidence?.minUsd !== undefined
        ? issue.evidence.minUsd.toString()
        : '',
  }

  const base = `info.routeIssue.${issue.bucket}`

  switch (issue.bucket) {
    case 'amountTooLow':
    case 'amountTooHigh': {
      if (suggested === undefined) {
        return {
          titleKey: `${base}.title`,
          descriptionKey: issue.evidence?.minUsd
            ? `${base}.descriptionUsd`
            : `${base}.descriptionNoAmount`,
          values,
        }
      }
      // A zero max means the balance is unknown (no wallet connected), not an
      // empty wallet, so it must not withdraw the fix. When the balance is
      // known and short, the description still states the amount to aim for,
      // so drop the action rather than render a control that cannot work.
      const unaffordable =
        issue.bucket === 'amountTooLow' &&
        maxSendAmount > 0n &&
        suggested > maxSendAmount
      return {
        titleKey: `${base}.title`,
        descriptionKey: `${base}.description`,
        values,
        remedy: unaffordable
          ? undefined
          : {
              labelKey: `${base}.action`,
              values,
              run: applyAmount,
            },
      }
    }
    case 'slippageTooTight': {
      if (issue.evidence?.requiredSlippage === undefined) {
        return {
          titleKey: `${base}.title`,
          descriptionKey: `${base}.descriptionNoAmount`,
          values,
        }
      }
      return {
        titleKey: `${base}.title`,
        descriptionKey: `${base}.description`,
        values,
        remedy: {
          labelKey: `${base}.action`,
          values,
          run: applySlippage,
        },
      }
    }
    case 'blockedBySettings': {
      const hasDisabledTools =
        disabledBridges.length > 0 || disabledExchanges.length > 0
      return {
        titleKey: `${base}.title`,
        descriptionKey: `${base}.description`,
        values,
        remedy: hasDisabledTools
          ? {
              labelKey: `${base}.action`,
              values,
              run: resetTools,
            }
          : undefined,
      }
    }
    case 'temporary': {
      return {
        titleKey: `${base}.title`,
        descriptionKey: `${base}.description`,
        values,
        note: issue.evidence?.note,
      }
    }
    default: {
      return {
        titleKey: `${base}.title`,
        descriptionKey: `${base}.description`,
        values,
      }
    }
  }
}
