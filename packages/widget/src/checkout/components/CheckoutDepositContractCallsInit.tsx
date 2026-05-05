import type { FC } from 'react'
import { useInsertionEffect } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'

/**
 * Core `useRoutes` gates custom flows on `Boolean(contractCalls && account.address)`. Deposit checkout
 * has no ContractComponent `contractCalls` in state, so normalize to `[]` (truthy) here — checkout-only,
 * avoids patching shared `useRoutes`.
 */
export const CheckoutDepositContractCallsInit: FC = () => {
  const { subvariant, subvariantOptions } = useWidgetConfig()
  const [contractCalls] = useFieldValues('contractCalls')
  const { setFieldValue } = useFieldActions()

  useInsertionEffect(() => {
    if (subvariant !== 'custom' || subvariantOptions?.custom !== 'deposit') {
      return
    }
    if (contractCalls != null) {
      return
    }
    setFieldValue('contractCalls', [], { isTouched: false })
  }, [contractCalls, setFieldValue, subvariant, subvariantOptions?.custom])

  return null
}
