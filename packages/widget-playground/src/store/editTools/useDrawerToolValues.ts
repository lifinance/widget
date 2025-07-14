import { shallow } from 'zustand/shallow'
import { defaultDrawerWidth } from './constants'
import { useEditToolsStore } from './EditToolsProvider'

export const useDrawerToolValues = () => {
  const [isDrawerOpen, codeDrawerWidth, visibleControls, codeControlTab] =
    useEditToolsStore(
      (store) => [
        store.drawer.open,
        store.drawer.codeDrawerWidth,
        store.drawer.visibleControls,
        store.codeControl.openTab,
        store.fontControl.selectedFont,
      ],
      shallow
    )

  const drawerWidth =
    visibleControls === 'code' && codeControlTab === 'config'
      ? codeDrawerWidth
      : defaultDrawerWidth

  return {
    isDrawerOpen,
    visibleControls,
    drawerWidth,
  }
}
