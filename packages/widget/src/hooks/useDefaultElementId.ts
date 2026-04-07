import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'

export const useDefaultElementId = (): string | undefined => {
  const { elementId } = useWidgetConfig()
  return elementId
}
