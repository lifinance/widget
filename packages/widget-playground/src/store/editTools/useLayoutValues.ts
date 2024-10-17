import { shallow } from 'zustand/shallow'
import { useEditToolsStore } from './EditToolsProvider'

export const useLayoutValues = () => {
  const [selectedLayoutId] = useEditToolsStore(
    (store) => [store.layoutControl.selectedLayoutId],
    shallow
  )

  return {
    selectedLayoutId,
  }
}
