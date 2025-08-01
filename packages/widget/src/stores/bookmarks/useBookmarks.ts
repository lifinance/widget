import { useBookmarkStore } from './BookmarkStore.js'
import type { BookmarkProps } from './types.js'

export const useBookmarks = (): BookmarkProps => {
  const [bookmarks, selectedBookmark, recentWallets] = useBookmarkStore(
    (store) => [store.bookmarks, store.selectedBookmark, store.recentWallets]
  )

  return {
    bookmarks,
    selectedBookmark,
    recentWallets,
  }
}
