import { ChainType } from '@lifi/sdk'
import type { BookmarkProps } from '@lifi/widget'
import { Box, Button } from '@mui/material'
import { useDevView } from '../../../../hooks/useDevView.js'
import {
  CapitalizeFirstLetter,
  ColorControlContainer,
} from '../DesignControls.style.js'

interface StoreProp {
  state: BookmarkProps
  version: number
}

const store = {
  state: {
    bookmarks: [],
    recentWallets: [],
  },
  version: 0,
}

// This function will populate the bookmarks with fake wallet data.
// These are not real wallet addresses and this data is only used to check
// the visual appearance of the bookmark list
const fillBookmarks = (store: StoreProp, num: number) => {
  for (let i = 0; i < num; i++) {
    store.state.bookmarks.push({
      name: `asdf ${i}`,
      address: `0x29DaCdF7cCaDf4eE67c923b4C22255A4B2494e${i}`,
      chainType: ChainType.EVM,
    })
  }

  return store
}

// This function will populate the recent wallets with fake wallet data.
// These are not real wallet addresses and this data is only used to check
// the visual appearance of the recent wallets list
const fillRecents = (store: StoreProp, num: number) => {
  for (let i = 0; i < num; i++) {
    store.state.recentWallets.push({
      address: `0x29DaCdF7cCaDf4eE67c923b4C22255A4B2494e${i}`,
      chainType: ChainType.EVM,
    })
  }

  return store
}

export const BookmarkStoreControls = () => {
  const { isDevView } = useDevView()

  const handleFill = () => {
    const newState = fillRecents(fillBookmarks(store, 50), 50)
    localStorage.setItem('li.fi-bookmarks', JSON.stringify(newState))
    window.location.reload()
  }

  const handleEmpty = () => {
    localStorage.setItem('li.fi-bookmarks', JSON.stringify(store))
    window.location.reload()
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
