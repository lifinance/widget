import { useBookmarkStore } from './BookmarkStore'
import type { BookmarkProps } from './types'

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
