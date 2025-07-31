import { useEditToolsStore } from './EditToolsProvider'

export const useFormValues = () => {
  const formValues = useEditToolsStore((store) => store.formValues)

  return {
    formValues,
  }
}
