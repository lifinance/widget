import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldActions } from '../stores/form/useFieldActions.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { useSettings } from '../stores/settings/useSettings.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'
import { getQueryKey } from '../utils/queries.js'
import type {
  RouteIssueCardContent,
  RouteIssueCardDeps,
} from '../utils/routeIssues/card.js'
import { buildRouteIssueCard } from '../utils/routeIssues/card.js'
import type { RouteIssue } from '../utils/routeIssues/types.js'
import { useApplyAmount } from './useApplyAmount.js'
import { useChain } from './useChain.js'
import { useToken } from './useToken.js'

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

  const deps: RouteIssueCardDeps = {
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

  return issue ? buildRouteIssueCard(issue, deps) : undefined
}
