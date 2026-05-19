import { useFieldActions } from './useFieldActions.js'

export const useClearAmountFields = (): (() => void) => {
  const { setFieldValue } = useFieldActions()
  return () => {
    setFieldValue('fromAmount', '')
    setFieldValue('toAmount', '')
  }
}
