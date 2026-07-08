import {
  useFieldActions,
  useFieldValues,
  useWidgetConfig,
} from '@lifi/widget/shared'
import type { FC } from 'react'
import { useInsertionEffect } from 'react'

/**
 * Core `useRoutes` gates custom flows on `Boolean(contractCalls && account.address)`. Deposit checkout
 * has no ContractComponent `contractCalls` in state, so normalize to `[]` (truthy) here — checkout-only,
 * avoids patching shared `useRoutes`.
 */
export const CheckoutDepositContractCallsInit: FC = () => {
  const { mode, modeOptions } = useWidgetConfig()
  const [contractCalls] = useFieldValues('contractCalls')
  const { setFieldValue } = useFieldActions()

  useInsertionEffect(() => {
    if (mode !== 'custom' || modeOptions?.custom?.type !== 'deposit') {
      return
    }
    if (contractCalls != null) {
      return
    }
    setFieldValue('contractCalls', [], { isTouched: false })
  }, [contractCalls, setFieldValue, mode, modeOptions?.custom?.type])

  return null
}
