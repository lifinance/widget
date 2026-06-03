import type { BookmarkProps } from '@lifi/widget'
import { ChainType } from '@lifi/widget'

interface StoreProp {
  state: BookmarkProps
  version: number
}

const createEmptyStore = (): StoreProp => ({
  state: {
    bookmarks: [],
    recentWallets: [],
  },
  version: 0,
})

const fillBookmarks = (store: StoreProp, num: number): StoreProp => {
  for (let i = 0; i < num; i++) {
    const hex = i.toString(16).padStart(2, '0')
    store.state.bookmarks.push({
      name: `asdf ${i}`,
      address: `0x29DaCdF7cCaDf4eE67c923b4C22255A4B24940${hex}`,
      chainType: ChainType.EVM,
    })
  }

  return store
}

const fillRecents = (store: StoreProp, num: number): StoreProp => {
  for (let i = 0; i < num; i++) {
    const hex = i.toString(16).padStart(2, '0')
    store.state.recentWallets.push({
      address: `0x29DaCdF7cCaDf4eE67c923b4C22255A4B24940${hex}`,
      chainType: ChainType.EVM,
    })
  }

  return store
}

/** Checks whether localStorage already has seeded bookmark data. */
export const readPlaygroundBookmarksSeeded = (): boolean => {
  if (typeof localStorage === 'undefined') {
    return false
  }
  try {
    const raw = localStorage.getItem('li.fi-bookmarks')
    if (!raw) {
      return false
    }
    const parsed = JSON.parse(raw) as StoreProp
    return (parsed.state?.bookmarks?.length ?? 0) > 0
  } catch {
    return false
  }
}

/** Fills localStorage with 50 dummy bookmarks and 50 recent wallets, then reloads. */
export const seedPlaygroundBookmarkStores = (): void => {
  const fresh = createEmptyStore()
  fillBookmarks(fresh, 50)
  fillRecents(fresh, 50)
  localStorage.setItem('li.fi-bookmarks', JSON.stringify(fresh))
  window.location.reload()
}

/** Resets localStorage bookmark store to empty and reloads. */
export const clearPlaygroundBookmarkStores = (): void => {
  localStorage.setItem('li.fi-bookmarks', JSON.stringify(createEmptyStore()))
  window.location.reload()
}
