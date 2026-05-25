export const defaultMaxHeight = 686
export const defaultHeaderHeight = 108
export const defaultSearchInputHeight = 34

// Prevents list pages (chain select, token select, activities) from collapsing
// when lists are empty or have few items and no explicit widget height is set.
export const listPageMinHeight: number =
  defaultMaxHeight - defaultHeaderHeight - defaultSearchInputHeight

export const internalExplorerUrl = 'https://scan.li.fi'
