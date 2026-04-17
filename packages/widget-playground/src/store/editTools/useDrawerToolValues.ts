import { defaultDrawerWidth } from './constants.js'
import { useEditToolsStore } from './EditToolsProvider.js'

export const useDrawerToolValues = (): {
  isDrawerOpen: boolean
  visibleControls: string
  drawerWidth: number
} => {
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
    isDrawerOpen: isDrawerOpen,
    visibleControls: visibleControls,
    drawerWidth: drawerWidth,
  }
}
