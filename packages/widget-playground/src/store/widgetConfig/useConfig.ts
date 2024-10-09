import { shallow } from 'zustand/shallow'
import { useWidgetConfigStore } from './WidgetConfigProvider'

export const useConfig = () => {
  const config = useWidgetConfigStore((state) => state.config, shallow)

  return {
    config,
  }
}
