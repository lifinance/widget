import { useEditToolsStore } from './EditToolsProvider.js'

export const useCodeToolValues = () => {
  const codeControlTab = useEditToolsStore((store) => store.codeControl.openTab)

  return {
    codeControlTab,
  }
}
