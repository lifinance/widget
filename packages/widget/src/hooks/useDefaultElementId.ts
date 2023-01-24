import { useWidgetConfig } from '../providers';

export const useDefaultElementId = () => {
  const { elementId } = useWidgetConfig();
  return elementId;
};
