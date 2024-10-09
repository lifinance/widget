import { useHasExternalWalletProvider } from '../providers/WalletProvider/useHasExternalWalletProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'

export const minHeaderHeight = 64
export const maxHeaderHeight = 108
export const maxHeaderHeightSubvariantSplit = 136

// We use fixed position on the header when Widget is in Full Height layout.
// We do this to get it to work like the sticky header does in the other layout modes.
// As the header is position fixed its not in the document flow anymore.
// To prevent the remaining page content from appearing behind the header we need to
// pass the headers height so that the position of the page content can be adjusted
export const useHeaderHeight = () => {
  const { hiddenUI, subvariant } = useWidgetConfig()
  const { hasExternalProvider } = useHasExternalWalletProvider()

  const headerHeight =
    subvariant === 'split'
      ? maxHeaderHeightSubvariantSplit
      : hiddenUI?.includes('walletMenu') || hasExternalProvider
        ? minHeaderHeight
        : maxHeaderHeight

  return {
    headerHeight,
  }
}
