import { useEditToolsStore } from './EditToolsProvider'

export const usePlaygroundSettingValues = () => {
  const viewportColor = useEditToolsStore(
    (store) => store.playgroundSettings.viewportColor
  )

  return {
    viewportColor,
  }
}
