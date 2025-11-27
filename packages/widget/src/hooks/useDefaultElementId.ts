import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider'

export const useDefaultElementId = () => {
  const { elementId } = useWidgetConfig()
  return elementId
}
