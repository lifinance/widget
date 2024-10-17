import { shallow } from 'zustand/shallow'
import { useEditToolsStore } from './EditToolsProvider'

export const useCodeToolValues = () => {
  const [codeControlTab] = useEditToolsStore(
    (store) => [store.codeControl.openTab],
    shallow
  )

  return {
    codeControlTab,
  }
}
