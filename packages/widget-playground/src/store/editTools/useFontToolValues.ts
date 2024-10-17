import { shallow } from 'zustand/shallow'
import { useEditToolsStore } from './EditToolsProvider'

export const useFontToolValues = () => {
  const [selectedFont] = useEditToolsStore(
    (store) => [store.fontControl.selectedFont],
    shallow
  )

  return {
    selectedFont,
  }
}
