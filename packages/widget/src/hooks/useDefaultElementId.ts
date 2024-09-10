import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';

export const useDefaultElementId = () => {
  const { elementId } = useWidgetConfig();
  return elementId;
};
