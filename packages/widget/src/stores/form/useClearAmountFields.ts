import { useCallback } from 'react'
import { useFieldActions } from './useFieldActions.js'

export const useClearAmountFields = (): (() => void) => {
  const { setFieldValue } = useFieldActions()
  return useCallback(() => {
    setFieldValue('fromAmount', '')
    setFieldValue('toAmount', '')
    // Clearing the amounts invalidates any limit provider pick (it was tied to
    // the prior quote), so reset it too — the next order starts on the best route.
    setFieldValue('selectedProviderKey', undefined)
  }, [setFieldValue])
}
