import type { SplitMode, SplitModeOptions } from '../types/widget.js'

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
