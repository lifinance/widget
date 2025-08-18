import { useEditToolsStore } from './EditToolsProvider.js'

export const useFormValues = () => {
  const formValues = useEditToolsStore((store) => store.formValues)

  return {
    formValues,
  }
}
