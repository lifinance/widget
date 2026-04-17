import type { TouchedFields } from './types.js'
import { useFormStore } from './useFormStore.js'

export const useTouchedFields = (): TouchedFields => {
  const touchedFields = useFormStore((store) => store.touchedFields)

  return touchedFields
}
