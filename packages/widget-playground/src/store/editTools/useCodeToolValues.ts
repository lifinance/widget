import { useEditToolsStore } from './EditToolsProvider'

export const useCodeToolValues = () => {
  const codeControlTab = useEditToolsStore((store) => store.codeControl.openTab)

  return {
    codeControlTab,
  }
}
