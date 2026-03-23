import type { ExtendedChain } from '@lifi/sdk'
import { useCallback } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useBookmarkActions } from '../stores/bookmarks/useBookmarkActions.js'
import { useBookmarks } from '../stores/bookmarks/useBookmarks.js'
import { useFieldActions } from '../stores/form/useFieldActions.js'
import { RequiredUI } from '../types/widget.js'

export const useToAddressReset = () => {
  const { requiredUI } = useWidgetConfig()
  const { setFieldValue } = useFieldActions()
  const { selectedBookmark } = useBookmarks()
  const { setSelectedBookmark } = useBookmarkActions()

  const tryResetToAddress = useCallback(
    (toChain: ExtendedChain) => {
      const requiredToAddress = requiredUI?.includes(RequiredUI.ToAddress)

      const bookmarkSatisfiesToChainType =
        selectedBookmark?.chainType === toChain?.chainType

      const shouldResetToAddress =
        !requiredToAddress && !bookmarkSatisfiesToChainType

      // We reset toAddress on each chain change if it's no longer required, ensuring that
      // switching chain types doesn't leave a stale toAddress from a different ecosystem.
      if (shouldResetToAddress) {
        setFieldValue('toAddress', '', { isTouched: true })
        setSelectedBookmark()
      }
    },
    [setFieldValue, setSelectedBookmark, requiredUI, selectedBookmark]
  )

  return {
    tryResetToAddress,
  }
}
