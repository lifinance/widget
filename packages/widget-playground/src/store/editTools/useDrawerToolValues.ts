import { defaultDrawerWidth } from './constants.js'
import { useEditToolsStore } from './EditToolsProvider.js'

export const useDrawerToolValues = (): {
  isDrawerOpen: boolean
  drawerWidth: number
} => {
  const isDrawerOpen = useEditToolsStore((store) => store.drawer.open)

  return {
    isDrawerOpen,
    drawerWidth: defaultDrawerWidth,
  }
}
