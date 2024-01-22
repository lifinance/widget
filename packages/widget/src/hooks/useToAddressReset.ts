import type { ExtendedChain } from '@lifi/sdk';
import { useWidgetConfig } from '../providers';
import { useBookmarkActions, useBookmarks, useFieldActions } from '../stores';
import { RequiredUI } from '../types';

export const useToAddressReset = () => {
  const { requiredUI } = useWidgetConfig();
  const { setFieldValue } = useFieldActions();
  const { selectedBookmark } = useBookmarks();
  const { setSelectedBookmark } = useBookmarkActions();

  const tryResetToAddress = (toChain: ExtendedChain) => {
    const requiredToAddress = requiredUI?.includes(RequiredUI.ToAddress);

    const bookmarkSatisfiesToChainType =
      selectedBookmark?.chainType === toChain?.chainType;

    const shouldResetToAddress =
      !requiredToAddress && !bookmarkSatisfiesToChainType;

    // toAddress field is required (always visible) when bridging between
    // two ecosystems (fromChain and toChain have different chain types).
    // We clean up toAddress on every chain change if toAddress is not required.
    // This is used when we switch between different chain ecosystems (chain types) and
    // prevents cases when after we switch the chain from one type to another "Send to wallet" field hides,
    // but it keeps toAddress value set for the previous chain pair.
    if (shouldResetToAddress) {
      setSelectedBookmark();
      setFieldValue('toAddress', '');
    }
  };

  return {
    tryResetToAddress,
  };
};
