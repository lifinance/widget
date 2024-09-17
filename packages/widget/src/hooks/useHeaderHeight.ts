import { useHasExternalWalletProvider } from '../providers/WalletProvider/useHasExternalWalletProvider.js';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';

export const minHeaderHeight = 64;
export const maxHeaderHeight = 108;
export const maxHeaderHeightSubvariantSplit = 136;

export const useHeaderHeight = () => {
  const { hiddenUI, subvariant } = useWidgetConfig();
  const { hasExternalProvider } = useHasExternalWalletProvider();

  const headerHeight =
    subvariant === 'split'
      ? maxHeaderHeightSubvariantSplit
      : hiddenUI?.includes('walletMenu') || hasExternalProvider
        ? minHeaderHeight
        : maxHeaderHeight;

  return {
    headerHeight,
  };
};
