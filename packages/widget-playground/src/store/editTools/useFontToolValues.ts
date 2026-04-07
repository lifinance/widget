import type { Font } from '../../providers/FontLoaderProvider/types.js'
import { useEditToolsStore } from './EditToolsProvider.js'

export const useFontToolValues = (): { selectedFont: Font | undefined } => {
  const selectedFont = useEditToolsStore(
    (store) => store.fontControl.selectedFont
  )

  return {
    selectedFont: selectedFont,
  }
}
