import { shallow } from 'zustand/shallow';
import { useEditToolsStore } from './EditToolsProvider';

export const useThemeToolValues = () => {
  const [selectedThemeId, allThemeItems] = useEditToolsStore(
    (store) => [
      store.themeControl.selectedThemeId,
      store.themeControl.widgetThemeItems,
    ],
    shallow,
  );

  const selectedTheme = allThemeItems?.find(
    (themeItem) => themeItem.id === selectedThemeId,
  );

  return {
    selectedThemeId,
    selectedTheme,
    allThemeItems,
  };
};
