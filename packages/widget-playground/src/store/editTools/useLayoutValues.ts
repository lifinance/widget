import { useEditToolsStore } from './EditToolsProvider'

export const useLayoutValues = () => {
  const selectedLayoutId = useEditToolsStore(
    (store) => store.layoutControl.selectedLayoutId
  )

  return {
    selectedLayoutId,
  }
}
