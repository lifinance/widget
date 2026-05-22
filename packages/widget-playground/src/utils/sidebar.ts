export const drawerZIndex = 1501
export const autocompletePopperZIndex: number = drawerZIndex + 1
export const tooltipPopperZIndex: number = drawerZIndex + 2

export const modeLabels: Record<string, string> = {
  exchange: 'Exchange',
  split: 'Swap or Bridge',
  swap: 'Swap',
  bridge: 'Bridge',
  refuel: 'Refuel',
}

export function getModeLabel(subvariant: string, splitOption?: string): string {
  if (subvariant === 'refuel') {
    return modeLabels.refuel
  }
  if (subvariant === 'split') {
    if (splitOption === 'swap') {
      return modeLabels.swap
    }
    if (splitOption === 'bridge') {
      return modeLabels.bridge
    }
    return modeLabels.split
  }
  return modeLabels.exchange
}

export function getWalletLabel(
  isExternal: boolean,
  isPartial: boolean
): string {
  if (!isExternal) {
    return 'Internal'
  }
  return isPartial ? 'Partial' : 'External'
}
