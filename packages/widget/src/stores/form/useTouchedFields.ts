import { useFormStore } from './useFormStore.js'

export const useTouchedFields = () => {
  const touchedFields = useFormStore((store) => store.touchedFields)

  return touchedFields
}
