import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useBookmarkActions } from '../stores/bookmarks/useBookmarkActions.js'
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
import { useMaxSendAmount } from './useMaxSendAmount.js'
import { useToAddressRequirements } from './useToAddressRequirements.js'
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
  const { setSelectedBookmark } = useBookmarkActions()
  // The user pressed a button on a card that is already on screen, so the quote
  // must start at once rather than wait the typing debounce out.
  const applyAmount = useApplyAmount('from', { immediate: true })
  const maxAmount = useMaxSendAmount(fromChainId, fromTokenAddress)
  const { setValue } = useSettingsActions()
  const { slippage } = useSettings(['slippage'])
  const { requiredToAddress, unsupportedReceiverBlocking } =
    useToAddressRequirements()

  const deps: RouteIssueCardDeps = {
    t,
    token,
    slippage,
    amountLocked: Boolean(disabledUI?.fromAmount),
    spendable: maxAmount,
    receiverHidden: Boolean(hiddenUI?.toAddress),
    receiverRequired: requiredToAddress || unsupportedReceiverBlocking,
    toAddress,
    sameEcosystem: Boolean(
      fromChain && toChain && fromChain.chainType === toChain.chainType
    ),
    applyAmount,
    applySlippage: (value) => setValue('slippage', value),
    // The selected bookmark has to go with it, as every other clear site does:
    // left behind it keeps the removed recipient's name on the receiver card,
    // and its chainType can satisfy the guard that resets a stale address.
    clearReceiver: () => {
      setFieldValue('toAddress', '', { isTouched: true })
      setSelectedBookmark()
    },
    retry: () =>
      queryClient.invalidateQueries({
        queryKey: [getQueryKey('routes', keyPrefix)],
        exact: false,
      }),
  }

  return issue ? buildRouteIssueCard(issue, deps) : undefined
}
