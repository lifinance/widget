import { useEditToolsStore } from './EditToolsProvider.js'

export const useLayoutValues = () => {
  const selectedLayoutId = useEditToolsStore(
    (store) => store.layoutControl.selectedLayoutId
  )

  return {
    selectedLayoutId,
  }
}
