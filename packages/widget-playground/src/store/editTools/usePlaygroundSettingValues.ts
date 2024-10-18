import { shallow } from 'zustand/shallow'
import { useEditToolsStore } from './EditToolsProvider'

export const usePlaygroundSettingValues = () => {
  const [viewportColor] = useEditToolsStore(
    (store) => [store.playgroundSettings.viewportColor],
    shallow
  )

  return {
    viewportColor,
  }
}
