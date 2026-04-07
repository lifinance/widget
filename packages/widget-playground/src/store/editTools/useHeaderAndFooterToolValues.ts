import { useEditToolsStore } from './EditToolsProvider.js'

export const useHeaderAndFooterToolValues = (): {
  showMockHeader: boolean
  showMockFooter: boolean
  isFooterFixed: boolean
} => {
  const [showMockHeader, showMockFooter, isFooterFixed] = useEditToolsStore(
    (store) => [
      store.headerAndFooterControl.showMockHeader,
      store.headerAndFooterControl.showMockFooter,
      store.headerAndFooterControl.isFooterFixed,
    ]
  )

  return {
    showMockHeader: showMockHeader,
    showMockFooter: showMockFooter,
    isFooterFixed: isFooterFixed,
  }
}
