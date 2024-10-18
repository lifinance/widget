import { shallow } from 'zustand/shallow'
import { useEditToolsStore } from './EditToolsProvider'

export const useHeaderAndFooterToolValues = () => {
  const [showMockHeader, showMockFooter, isFooterFixed] = useEditToolsStore(
    (store) => [
      store.headerAndFooterControl.showMockHeader,
      store.headerAndFooterControl.showMockFooter,
      store.headerAndFooterControl.isFooterFixed,
    ],
    shallow
  )

  return {
    showMockHeader,
    showMockFooter,
    isFooterFixed,
  }
}
