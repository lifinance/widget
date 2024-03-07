import { shallow } from 'zustand/shallow';
import { useEditToolsStore } from './EditToolsProvider';
import { defaultDrawerWidth } from './constants';

export const useEditToolsValues = () => {
  const [
    isDrawerOpen,
    codeDrawerWidth,
    visibleControls,
    codeControlTab,
    selectedFont,
  ] = useEditToolsStore(
    (store) => [
      store.drawer.open,
      store.drawer.codeDrawerWidth,
      store.drawer.visibleControls,
      store.codeControl.openTab,
      store.fontControl.selectedFont,
    ],
    shallow,
  );

  const drawerWidth =
    visibleControls === 'code' && codeControlTab === 'config'
      ? codeDrawerWidth
      : defaultDrawerWidth;

  return {
    isDrawerOpen,
    codeDrawerWidth,
    visibleControls,
    drawerWidth,
    codeControlTab,
    selectedFont,
  };
};
