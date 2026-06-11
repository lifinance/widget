import type {
  ModeOptions,
  SplitMode,
  SplitModeOptions,
  WidgetMode,
} from '../../types/widget.js'
import type { HeaderTab } from './types.js'

export const getSplitMode = (
  split?: SplitMode | SplitModeOptions
): SplitMode => {
  if (!split) {
    return 'swap'
  }
  if (typeof split === 'string') {
    return split
  }
  return split.defaultTab
}

export function getDefaultTab(
  mode: WidgetMode,
  modeOptions?: ModeOptions,
  tabs?: HeaderTab[]
): HeaderTab | undefined {
  if (!tabs?.length) {
    return undefined
  }

  if (mode === 'split') {
    const splitMode = getSplitMode(modeOptions?.split)
    return tabs.find((tab) => tab.modeOptions?.split === splitMode) ?? tabs[0]
  }

  return tabs[0]
}
