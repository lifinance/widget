import type { BookmarkProps } from '@lifi/widget'
import { ChainType } from '@lifi/widget'
import { Box, Button } from '@mui/material'
import type { JSX } from 'react'
import { useDevView } from '../../../../hooks/useDevView.js'
import {
  CapitalizeFirstLetter,
  ColorControlContainer,
} from '../DesignControls.style.js'

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
    store.state.bookmarks.push({
      name: `asdf ${i}`,
      address: `0x29DaCdF7cCaDf4eE67c923b4C22255A4B2494e${i}`,
      chainType: ChainType.EVM,
    })
  }

  return store
}

const fillRecents = (store: StoreProp, num: number): StoreProp => {
  for (let i = 0; i < num; i++) {
    store.state.recentWallets.push({
      address: `0x29DaCdF7cCaDf4eE67c923b4C22255A4B2494e${i}`,
      chainType: ChainType.EVM,
    })
  }

  return store
}

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

export const seedPlaygroundBookmarkStores = (): void => {
  const fresh = createEmptyStore()
  fillBookmarks(fresh, 50)
  fillRecents(fresh, 50)
  localStorage.setItem('li.fi-bookmarks', JSON.stringify(fresh))
  window.location.reload()
}

export const clearPlaygroundBookmarkStores = (): void => {
  localStorage.setItem('li.fi-bookmarks', JSON.stringify(createEmptyStore()))
  window.location.reload()
}

export const BookmarkStoreControls = (): JSX.Element | null => {
  const { isDevView } = useDevView()

  const handleFill = (): void => {
    seedPlaygroundBookmarkStores()
  }

  const handleEmpty = (): void => {
    clearPlaygroundBookmarkStores()
  }

  return isDevView ? (
    <ColorControlContainer>
      <CapitalizeFirstLetter>Bookmark store</CapitalizeFirstLetter>
      <Box sx={{ display: 'flex', gap: 1, pr: 1 }}>
        <Button variant="contained" onClick={handleFill}>
          Fill
        </Button>
        <Button variant="contained" onClick={handleEmpty}>
          Empty
        </Button>
      </Box>
    </ColorControlContainer>
  ) : null
}
