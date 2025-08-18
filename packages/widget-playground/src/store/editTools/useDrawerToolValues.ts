import { defaultDrawerWidth } from './constants.js'
import { useEditToolsStore } from './EditToolsProvider.js'

export const useDrawerToolValues = () => {
  const [isDrawerOpen, codeDrawerWidth, visibleControls, codeControlTab] =
    useEditToolsStore((store) => [
      store.drawer.open,
      store.drawer.codeDrawerWidth,
      store.drawer.visibleControls,
      store.codeControl.openTab,
      store.fontControl.selectedFont,
    ])

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
