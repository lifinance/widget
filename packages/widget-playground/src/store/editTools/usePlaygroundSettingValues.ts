import { useShallow } from 'zustand/shallow'
import { useEditToolsStore } from './EditToolsProvider.js'

export const usePlaygroundSettingValues = (): {
  viewportColorLight: string | undefined
  viewportColorDark: string | undefined
} => {
  const { viewportColorLight, viewportColorDark } = useEditToolsStore(
    useShallow((store) => store.playgroundSettings)
  )

  return {
    viewportColorLight,
    viewportColorDark,
  }
}
