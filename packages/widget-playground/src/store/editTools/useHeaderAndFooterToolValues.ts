import { useEditToolsStore } from './EditToolsProvider'

export const useHeaderAndFooterToolValues = () => {
  const [showMockHeader, showMockFooter, isFooterFixed] = useEditToolsStore(
    (store) => [
      store.headerAndFooterControl.showMockHeader,
      store.headerAndFooterControl.showMockFooter,
      store.headerAndFooterControl.isFooterFixed,
    ]
  )

  return {
    showMockHeader,
    showMockFooter,
    isFooterFixed,
  }
}
