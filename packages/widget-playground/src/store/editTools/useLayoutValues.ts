import { useEditToolsStore } from './EditToolsProvider.js'
import type { Layout } from './types.js'

export const useLayoutValues = (): { selectedLayoutId: Layout } => {
  const selectedLayoutId = useEditToolsStore(
    (store) => store.layoutControl.selectedLayoutId
  )

  return {
    selectedLayoutId: selectedLayoutId,
  }
}
