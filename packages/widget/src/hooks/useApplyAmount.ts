import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldActions } from '../stores/form/useFieldActions.js'
import { useLinkedLimitFields } from './useLinkedLimitFields.js'

/**
 * In limit mode the send amount must flow through the linked-field derivation
 * so the receive amount recomputes; otherwise it is a plain form-field write.
 */
export const useApplyAmount = (
  formType: FormType
): ((value: string) => void) => {
  const { mode } = useWidgetConfig()
  const { setFieldValue } = useFieldActions()
  const { setSendAmount } = useLinkedLimitFields()

  return (value: string): void => {
    if (mode === 'limit') {
      setSendAmount(value, true)
      return
    }
    setFieldValue(FormKeyHelper.getAmountKey(formType), value, {
      isTouched: true,
      immediate: true,
    })
  }
}
