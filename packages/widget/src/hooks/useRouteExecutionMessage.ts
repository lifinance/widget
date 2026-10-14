import type { RouteExtended } from '@lifi/sdk'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { RouteExecutionStatus } from '../stores/routes/types.js'
import { getFailedStepAction } from '../stores/routes/utils.js'
import { getActionMessage } from '../utils/getActionMessage.js'
import { getErrorMessage } from '../utils/getErrorMessage.js'
import { useAvailableChains } from './useAvailableChains.js'

export const useRouteExecutionMessage = (
  route: RouteExtended,
  status: RouteExecutionStatus
): { title: string | undefined; message: string | undefined } => {
  const { mode, modeOptions } = useWidgetConfig()
  const { t } = useTranslation()
  const { getChainById } = useAvailableChains()

  const transactionType =
    route.fromChainId === route.toChainId ? 'swap' : 'bridge'

  let title: string | undefined
  let message: string | undefined

  switch (status) {
    case RouteExecutionStatus.Pending: {
      // Use the first executing step, not the last one — in a multi-step route
      // the active step is often not the last.
      const activeStep =
        route.steps.find(
          (s) =>
            s.execution?.status === 'PENDING' ||
            s.execution?.status === 'ACTION_REQUIRED'
        ) ?? route.steps.at(-1)
      const lastAction = activeStep?.execution?.actions?.at(-1)
      const actionMessage =
        activeStep && lastAction
          ? getActionMessage(
              t,
              activeStep,
              lastAction.type,
              lastAction.status,
              lastAction.substatus,
              mode,
              modeOptions
            )
          : undefined
      // Fall back to a generic title when the step has no action to describe yet
      // (just after a restart, or before the first action exists).
      title =
        actionMessage?.title ?? t(`main.process.${transactionType}.pending`)
      message = actionMessage?.message
      break
    }
    case RouteExecutionStatus.Done: {
      title =
        mode === 'custom'
          ? t(
              `success.title.${modeOptions?.custom?.type ?? 'checkout'}Successful`
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
      const failed = getFailedStepAction(route)
      if (!failed) {
        break
      }
      const actionMessage = getErrorMessage(
        t,
        getChainById,
        failed.step,
        failed.action
      )
      title = actionMessage.title
      message = actionMessage.message
      break
    }
  }

  return { title, message }
}
