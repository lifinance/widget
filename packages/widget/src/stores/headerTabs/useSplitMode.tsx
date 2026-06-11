import type { SplitMode } from '../../types/widget.js'
import { useHeaderTabsStore } from './useHeaderTabsStore.js'

export const useSplitMode = (): SplitMode | undefined => {
  const activeTab = useHeaderTabsStore((state) => state.activeTab)

  if (activeTab?.mode === 'split') {
    return (activeTab?.modeOptions?.split as SplitMode) ?? 'swap'
  }

  return undefined
}
