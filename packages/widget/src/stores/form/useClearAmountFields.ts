import { useCallback } from 'react'
import { useFieldActions } from './useFieldActions.js'

export const useClearAmountFields = (): (() => void) => {
  const { setFieldValue } = useFieldActions()
  return useCallback(() => {
    setFieldValue('fromAmount', '')
    setFieldValue('toAmount', '')
    setFieldValue('selectedRouteId', undefined)
  }, [setFieldValue])
}
