import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldActions } from '../stores/form/useFieldActions.js'
import { useLinkedLimitFields } from './useLinkedLimitFields.js'

/**
 * In limit mode the send amount must flow through the linked-field derivation
 * so the receive amount recomputes; otherwise it is a plain form-field write.
 *
 * `immediate` skips the typing debounce so the quote starts at once. Only the
 * route-issue card wants that: its button is the user's answer to a card that is
 * already on screen. The percentage chips are easy to click in a burst, and
 * skipping the debounce there sends a quote per click.
 */
export const useApplyAmount = (
  formType: FormType,
  { immediate = false }: { immediate?: boolean } = {}
): ((value: string) => void) => {
  const { mode } = useWidgetConfig()
  const { setFieldValue } = useFieldActions()
  const { setSendAmount } = useLinkedLimitFields()

  return (value: string): void => {
    if (mode === 'limit') {
      setSendAmount(value, immediate)
      return
    }
    setFieldValue(FormKeyHelper.getAmountKey(formType), value, {
      isTouched: true,
      immediate,
    })
  }
}
