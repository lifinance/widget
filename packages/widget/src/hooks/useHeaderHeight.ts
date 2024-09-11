import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';

export const minHeaderHeight = 64;
export const maxHeaderHeight = 108;
export const maxHeaderHeightSubvariantSplit = 136;

export const useHeaderHeight = () => {
  const { hiddenUI, subvariant } = useWidgetConfig();

  const headerHeight =
    subvariant === 'split'
      ? maxHeaderHeightSubvariantSplit
      : hiddenUI?.includes('walletMenu')
        ? minHeaderHeight
        : maxHeaderHeight;

  return {
    headerHeight,
  };
};
