import type {
  SplitSubvariant,
  SplitSubvariantOptions,
} from '../types/widget.js'

export const getSplitSubvariant = (
  split?: SplitSubvariant | SplitSubvariantOptions
): SplitSubvariant => {
  if (!split) {
    return 'swap'
  }
  if (typeof split === 'string') {
    return split
  }
  return split.defaultTab
}
