import { shallow } from 'zustand/shallow'
import { useWidgetConfigStore } from './WidgetConfigProvider'

export const useConfigAppearance = () => {
  const [appearance] = useWidgetConfigStore(
    (store) => [store.config?.appearance],
    shallow
  )

  return {
    appearance: !appearance ? 'auto' : appearance,
  }
}
