import { useEditToolsStore } from './EditToolsProvider'

export const useFontToolValues = () => {
  const selectedFont = useEditToolsStore(
    (store) => store.fontControl.selectedFont
  )

  return {
    selectedFont,
  }
}
