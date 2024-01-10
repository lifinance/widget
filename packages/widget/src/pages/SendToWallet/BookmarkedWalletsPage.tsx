import { useRef, useState } from 'react';
import { Button } from '@mui/material';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import {
  ListContainer,
  SendToWalletPageContainer,
} from './SendToWalletPage.style';
import { useTranslation } from 'react-i18next';
import type { BottomSheetBase } from '../../components/BottomSheet';
import type { BookmarkedWallet } from '../../stores';
import { useBookmarks, useBookmarksActions } from '../../stores';
import { BookmarkAddressSheet } from './BookmarkAddressSheet';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
import { EmptyListIndicator } from './EmptyListIndicator';
import { ListItem } from './ListItem';
export const BookmarkedWalletsPage = () => {
  const { t } = useTranslation();
  const [selectedBookmark, setSelectedBookmark] = useState<
    BookmarkedWallet | undefined
  >();
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null);
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const { bookmarkedWallets } = useBookmarks();
  const { addBookmarkedWallet, removeBookmarkedWallet } = useBookmarksActions();

  const handleAddBookmark = () => {
    bookmarkAddressSheetRef.current?.open();
  };

  const handleBookmarkSelected = (bookmark: BookmarkedWallet) => {
    setSelectedBookmark(bookmark);
    confirmAddressSheetRef.current?.open();
  };

  return (
    <SendToWalletPageContainer topBottomGutters>
      <ListContainer>
        {bookmarkedWallets.map((bookmark) => (
          <ListItem
            key={bookmark.id}
            bookmark={bookmark}
            onSelected={handleBookmarkSelected}
            onRemove={removeBookmarkedWallet}
          />
        ))}
        {!bookmarkedWallets.length && (
          <EmptyListIndicator icon={<TurnedInIcon sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noBookmarkedWallets')}
          </EmptyListIndicator>
        )}
      </ListContainer>
      <Button variant="contained" onClick={handleAddBookmark}>
        {t('sendToWallet.addBookmark')}
      </Button>
      <BookmarkAddressSheet
        ref={bookmarkAddressSheetRef}
        onAddBookmark={addBookmarkedWallet}
      />
      <ConfirmAddressSheet
        ref={confirmAddressSheetRef}
        address={selectedBookmark?.address || ''}
        bookmark={selectedBookmark}
      />
    </SendToWalletPageContainer>
  );
};
