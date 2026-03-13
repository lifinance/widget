import type { RouteExtended } from '@lifi/sdk'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { RouteExecutionStatus } from '../stores/routes/types.js'
import { getActionMessage } from '../utils/getActionMessage.js'
import { getErrorMessage } from '../utils/getErrorMessage.js'
import { useAvailableChains } from './useAvailableChains.js'

export const useRouteExecutionMessage = (
  route: RouteExtended,
  status: RouteExecutionStatus
) => {
  const { subvariant, subvariantOptions } = useWidgetConfig()
  const { t } = useTranslation()
  const { getChainById } = useAvailableChains()

  const transactionType =
    route.fromChainId === route.toChainId ? 'swap' : 'bridge'

  let title: string | undefined
  let message: string | undefined

  switch (status) {
    case RouteExecutionStatus.Pending: {
      const lastStep = route.steps.at(-1)
      const lastAction = lastStep?.execution?.actions?.at(-1)
      if (!lastStep || !lastAction) {
        break
      }
      const actionMessage = getActionMessage(
        t,
        lastStep,
        lastAction.type,
        lastAction.status,
        lastAction.substatus,
        subvariant,
        subvariantOptions
      )
      title = actionMessage.title
      message = actionMessage.message
      break
    }
    case RouteExecutionStatus.Done: {
      title =
        subvariant === 'custom'
          ? t(
              `success.title.${subvariantOptions?.custom ?? 'checkout'}Successful`
            )
          : t(`success.title.${transactionType}Successful`)
      break
    }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Partial: {
      title = t(`success.title.${transactionType}PartiallySuccessful`)
      message = t('success.message.exchangePartiallySuccessful', {
        tool: route.steps.at(-1)?.toolDetails.name,
        tokenSymbol: route.steps.at(-1)?.action.toToken.symbol,
      })
      break
    }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Refunded: {
      title = t('success.title.refundIssued')
      message = t('success.message.exchangePartiallySuccessful', {
        tool: route.steps.at(-1)?.toolDetails.name,
        tokenSymbol: route.steps.at(-1)?.action.toToken.symbol,
      })
      break
    }
    case RouteExecutionStatus.Failed: {
      const step = route.steps.find(
        (step) => step.execution?.status === 'FAILED'
      )
      if (!step) {
        break
      }
      const action = step.execution?.actions.find(
        (action) => action.status === 'FAILED'
      )
      const actionMessage = getErrorMessage(t, getChainById, step, action)
      title = actionMessage.title
      message = actionMessage.message
      break
    }
  }

  return { title, message }
}
