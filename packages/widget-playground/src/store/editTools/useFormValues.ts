import type { FormValues } from '../types.js'
import { useEditToolsStore } from './EditToolsProvider.js'

export const useFormValues = (): {
  formValues: Partial<FormValues> | undefined
} => {
  const formValues = useEditToolsStore((store) => store.formValues)

  return {
    formValues: formValues,
  }
}
