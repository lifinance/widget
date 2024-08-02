import { ChainType } from '@lifi/types';
import type { BookmarkProps } from '@lifi/widget/stores/bookmarks/types';
import { Box, Button } from '@mui/material';
import { useDevView } from '../../../../hooks';
import {
  CapitalizeFirstLetter,
  ColorSelectorContainer,
} from '../DesignControls.style';

interface StoreProp {
  state: BookmarkProps;
  version: number;
}

const store = {
  state: {
    bookmarks: [],
    recentWallets: [],
  },
  version: 0,
};

const fillBookmarks = (store: StoreProp, num: number) => {
  for (let i = 0; i < num; i++) {
    store.state.bookmarks.push({
      name: `asdf ${i}`,
      address: `0x29DaCdF7cCaDf4eE67c923b4C22255A4B2494e${i}`,
      chainType: ChainType.EVM,
    });
  }

  return store;
};

const fillRecents = (store: StoreProp, num: number) => {
  for (let i = 0; i < num; i++) {
    store.state.recentWallets.push({
      address: `0x29DaCdF7cCaDf4eE67c923b4C22255A4B2494e${i}`,
      chainType: ChainType.EVM,
    });
  }

  return store;
};

export const BookmarkStoreControls = () => {
  const { isDevView } = useDevView();

  const handleFill = () => {
    const newState = fillRecents(fillBookmarks(store, 50), 50);
    localStorage.setItem('li.fi-bookmarks', JSON.stringify(newState));
    window.location.reload();
  };

  const handleEmpty = () => {
    localStorage.setItem('li.fi-bookmarks', JSON.stringify(store));
    window.location.reload();
  };

  return isDevView ? (
    <ColorSelectorContainer sx={{ marginTop: 1 }}>
      <CapitalizeFirstLetter>Bookmark store</CapitalizeFirstLetter>
      <Box sx={{ display: 'flex', gap: 1, pr: 1 }}>
        <Button variant="outlined" onClick={handleFill}>
          Fill
        </Button>
        <Button variant="outlined" onClick={handleEmpty}>
          Empty
        </Button>
      </Box>
    </ColorSelectorContainer>
  ) : null;
};
