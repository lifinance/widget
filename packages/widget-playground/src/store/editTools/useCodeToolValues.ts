import { useEditToolsStore } from './EditToolsProvider.js'

export const useCodeToolValues = (): { codeControlTab: string } => {
  const codeControlTab = useEditToolsStore((store) => store.codeControl.openTab)

  return {
    codeControlTab: codeControlTab,
  }
}
