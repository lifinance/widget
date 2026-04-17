import { useEditToolsStore } from './EditToolsProvider.js'

export const usePlaygroundSettingValues = (): {
  viewportColor: string | undefined
} => {
  const viewportColor = useEditToolsStore(
    (store) => store.playgroundSettings.viewportColor
  )

  return {
    viewportColor: viewportColor,
  }
}
