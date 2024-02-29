import { shallow } from 'zustand/shallow';
import { useEditToolsStore } from './EditToolsProvider';

export const useEditToolsValues = () => {
  const [isDrawerOpen, codeDrawerWidth, visibleControls] = useEditToolsStore(
    (store) => [
      store.drawer.open,
      store.drawer.codeDrawerWidth,
      store.drawer.visibleControls,
    ],
    shallow,
  );

  return {
    isDrawerOpen,
    codeDrawerWidth,
    visibleControls,
  };
};
