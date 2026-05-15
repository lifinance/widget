import { useEditToolsStore } from './EditToolsProvider.js'

export const usePlaygroundSettingValues = (): {
  viewportColorLight: string | undefined
  viewportColorDark: string | undefined
} => {
  const viewportColorLight = useEditToolsStore(
    (store) => store.playgroundSettings.viewportColorLight
  )
  const viewportColorDark = useEditToolsStore(
    (store) => store.playgroundSettings.viewportColorDark
  )

  return {
    viewportColorLight,
    viewportColorDark,
  }
}
