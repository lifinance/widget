import { useConfigActions, useThemeHeader } from '../widgetConfig';
import { useEditToolsActions } from './useEditToolsActions';

export const useSetViewportBackgroundColor = () => {
  const { header } = useThemeHeader();
  const { setHeader } = useConfigActions();
  const { setViewportBackgroundColor: setViewportColorEditTools } =
    useEditToolsActions();

  const setViewportBackgroundColor = (color: string | undefined) => {
    if (header) {
      setHeader({
        ...header,
        pageBackground: color,
      });
    }

    setViewportColorEditTools(color);
  };

  return { setViewportBackgroundColor };
};
