import { useEditToolsStore } from './EditToolsProvider.js'

export const useFontToolValues = () => {
  const selectedFont = useEditToolsStore(
    (store) => store.fontControl.selectedFont
  )

  return {
    selectedFont,
  }
}
