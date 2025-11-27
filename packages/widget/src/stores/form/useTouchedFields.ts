import { useFormStore } from './useFormStore'

export const useTouchedFields = () => {
  const touchedFields = useFormStore((store) => store.touchedFields)

  return touchedFields
}
