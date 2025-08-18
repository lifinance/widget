import { useEditToolsStore } from './EditToolsProvider.js'

export const usePlaygroundSettingValues = () => {
  const viewportColor = useEditToolsStore(
    (store) => store.playgroundSettings.viewportColor
  )

  return {
    viewportColor,
  }
}
