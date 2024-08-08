import { shallow } from 'zustand/shallow';
import { useEditToolsStore } from './EditToolsProvider';

export const useHeaderAndFooterToolValues = () => {
  const [showMockHeader, showMockFooter] = useEditToolsStore(
    (store) => [
      store.headerAndFooterControl.showMockHeader,
      store.headerAndFooterControl.showMockFooter,
    ],
    shallow,
  );

  return {
    showMockHeader,
    showMockFooter,
  };
};
