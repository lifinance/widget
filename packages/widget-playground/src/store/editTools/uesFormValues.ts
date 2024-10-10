import { shallow } from 'zustand/shallow'
import { useEditToolsStore } from './EditToolsProvider'

export const useFormValues = () => {
  const [formValues] = useEditToolsStore((store) => [store.formValues], shallow)

  return {
    formValues,
  }
}
