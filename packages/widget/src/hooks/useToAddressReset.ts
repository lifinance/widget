import type { ExtendedChain } from '@lifi/sdk'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useBookmarkActions } from '../stores/bookmarks/useBookmarkActions.js'
import { useBookmarks } from '../stores/bookmarks/useBookmarks.js'
import { useFieldActions } from '../stores/form/useFieldActions.js'
import { useSendToWalletActions } from '../stores/settings/useSendToWalletStore.js'
import { RequiredUI } from '../types/widget.js'

export const useToAddressReset = () => {
  const { requiredUI } = useWidgetConfig()
  const { setFieldValue, isDirty } = useFieldActions()
  const { selectedBookmark } = useBookmarks()
  const { setSelectedBookmark } = useBookmarkActions()
  const { setSendToWallet } = useSendToWalletActions()

  const tryResetToAddress = (toChain: ExtendedChain) => {
    const requiredToAddress = requiredUI?.includes(RequiredUI.ToAddress)

    const bookmarkSatisfiesToChainType =
      selectedBookmark?.chainType === toChain?.chainType

    const shouldResetToAddress =
      !requiredToAddress && !bookmarkSatisfiesToChainType

    // The toAddress field is required and always visible when bridging between
    // different ecosystems (fromChain and toChain have different chain types).
    // We reset toAddress on each chain change if it's no longer required, ensuring that
    // switching chain types doesn't leave a previously set toAddress value when
    // the "Send to Wallet" field is hidden.
    if (shouldResetToAddress) {
      setFieldValue('toAddress', '', { isTouched: true })
      setSelectedBookmark()
      // If toAddress was auto-filled (e.g., when making cross-ecosystem bridging and compatible destination wallet was connected)
      // and not manually edited by the user, we need to hide "Send to Wallet".
      const isToAddressDirty = isDirty('toAddress')
      if (!isToAddressDirty) {
        setSendToWallet(false)
      }
    }
  }

  return {
    tryResetToAddress,
  }
}
