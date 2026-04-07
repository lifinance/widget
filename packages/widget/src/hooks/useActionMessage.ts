import type { ExecutionAction, LiFiStepExtended } from '@lifi/sdk'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { getActionMessage } from '../utils/getActionMessage.js'
import { getErrorMessage } from '../utils/getErrorMessage.js'
import { useAvailableChains } from './useAvailableChains.js'

export const useActionMessage = (
  step?: LiFiStepExtended,
  action?: ExecutionAction
): { title?: string; message?: string } => {
  const { subvariant, subvariantOptions } = useWidgetConfig()
  const { t } = useTranslation()
  const { getChainById } = useAvailableChains()

  if (!step || !action) {
    return {}
  }

  if (action.status === 'FAILED') {
    return getErrorMessage(t, getChainById, step, action)
  }

  return getActionMessage(
    t,
    step,
    action.type,
    action.status,
    action.substatus,
    subvariant,
    subvariantOptions
  )
}
