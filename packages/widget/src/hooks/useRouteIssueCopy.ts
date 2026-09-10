import { formatUnits } from '@lifi/sdk'
import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldActions } from '../stores/form/useFieldActions.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'
import { formatSlippage } from '../utils/format.js'
import type { RouteIssue } from '../utils/routeIssues/types.js'
import { useLinkedLimitFields } from './useLinkedLimitFields.js'
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

// useSettingMonitor badges anything above this as not recommended, so it is
// not something to apply in one click.
const recommendedSlippageLimit = 1

const buffer = {
  raise: { numerator: 102n, denominator: 100n },
  lower: { numerator: 98n, denominator: 100n },
}

export function useRouteIssueCopy(issue: RouteIssue): RouteIssueCopy {
  const { disabledUI, mode } = useWidgetConfig()
  const [fromChainId, fromTokenAddress, fromAmount] = useFieldValues(
    FormKeyHelper.getChainKey('from'),
    FormKeyHelper.getTokenKey('from'),
    FormKeyHelper.getAmountKey('from')
  )
  const { token } = useToken(fromChainId, fromTokenAddress)
  const { setFieldValue } = useFieldActions()
  const { setSendAmount } = useLinkedLimitFields()
  const { setValue } = useSettingsActions()
  const maxSendAmount = useMaxSendAmount(fromChainId, fromTokenAddress)

  // The classifier already resolved this against the amount the query used, so
  // it cannot drift with the debounced form field.
  const suggested = useMemo(() => {
    const required = issue.evidence?.requiredFromAmount
    if (required === undefined || required <= 0n) {
      return undefined
    }
    const { numerator, denominator } =
      buffer[issue.evidence?.direction ?? 'raise']
    const raw = (required * numerator) / denominator
    return raw > 0n ? raw : undefined
  }, [issue.evidence?.requiredFromAmount, issue.evidence?.direction])

  // One value drives both the label and the write, so they can never disagree.
  const suggestedLabel =
    suggested !== undefined && token
      ? formatUnits(suggested, token.decimals)
      : ''

  // Matches PercentageChips: in limit mode the send amount must flow through
  // the linked-field derivation so the receive amount recomputes.
  const applyAmount = (): void => {
    if (mode === 'limit') {
      setSendAmount(suggestedLabel)
      return
    }
    setFieldValue(FormKeyHelper.getAmountKey('from'), suggestedLabel, {
      isTouched: true,
    })
  }

  // Rounded so binary error can't leak "2.9000000000000004" into the setting.
  const requiredSlippage = issue.evidence?.requiredSlippage
  const slippageLabel =
    requiredSlippage !== undefined
      ? formatSlippage((Math.round(requiredSlippage * 1e6) / 1e4).toString())
      : ''

  const applySlippage = (): void => {
    setValue('slippage', slippageLabel)
  }

  const values: Record<string, string> = {
    symbol: token?.symbol ?? '',
    current: String(fromAmount ?? ''),
    suggested: suggestedLabel,
    slippage: slippageLabel,
    minUsd:
      issue.evidence?.minUsd !== undefined
        ? issue.evidence.minUsd.toString()
        : '',
  }

  const base = `info.routeIssue.${issue.bucket}`

  switch (issue.bucket) {
    case 'amountTooLow':
    case 'amountTooHigh': {
      if (!suggestedLabel) {
        return {
          titleKey: `${base}.title`,
          descriptionKey:
            issue.bucket === 'amountTooLow' && issue.evidence?.minUsd
              ? `${base}.descriptionUsd`
              : `${base}.descriptionNoAmount`,
          values,
        }
      }
      // A zero max means the balance is unknown, not empty, so it can't veto.
      const unaffordable =
        issue.bucket === 'amountTooLow' &&
        maxSendAmount > 0n &&
        suggested !== undefined &&
        suggested > maxSendAmount
      return {
        titleKey: `${base}.title`,
        descriptionKey: `${base}.description`,
        values,
        remedy:
          unaffordable || disabledUI?.fromAmount
            ? undefined
            : {
                labelKey: `${base}.action`,
                values,
                run: applyAmount,
              },
      }
    }
    case 'slippageTooTight': {
      if (!slippageLabel) {
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
        remedy:
          Number(slippageLabel) > recommendedSlippageLimit
            ? undefined
            : {
                labelKey: `${base}.action`,
                values,
                run: applySlippage,
              },
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
