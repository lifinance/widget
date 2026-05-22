import { useEditToolsStore } from './EditToolsProvider.js'

export const usePlaygroundSettingValues = (): {
  viewportColorLight: string | undefined
  viewportColorDark: string | undefined
} => {
  const { viewportColorLight, viewportColorDark } = useEditToolsStore(
    (store) => store.playgroundSettings
  )

  return {
    viewportColorLight,
    viewportColorDark,
  }
}
