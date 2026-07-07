import { useFieldActions, useFieldValues } from '@lifi/widget/shared'
import { useEffect } from 'react'
import { useResolvedCheckoutRecipient } from './useResolvedCheckoutRecipient.js'

/** Mirrors the user-set recipient into the form's `toAddress` so route/SDK execution picks it up. */
export function useSyncCheckoutRecipientToForm(): void {
  const { recipient, isUserSettable } = useResolvedCheckoutRecipient()
  const [formToAddress] = useFieldValues('toAddress')
  const { setFieldValue } = useFieldActions()

  const recipientAddress = recipient?.address

  useEffect(() => {
    if (!isUserSettable) {
      return
    }
    const desired = recipientAddress ?? ''
    if ((formToAddress ?? '') !== desired) {
      setFieldValue('toAddress', desired, { isDirty: false, isTouched: true })
    }
  }, [isUserSettable, recipientAddress, formToAddress, setFieldValue])
}
