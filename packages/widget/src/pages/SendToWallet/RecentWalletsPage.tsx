import { useRef, useState } from 'react';
import WalletIcon from '@mui/icons-material/Wallet';
import {
  ListContainer,
  SendToWalletPageContainer,
} from './SendToWalletPage.style';
import { useTranslation } from 'react-i18next';
import type { BottomSheetBase } from '../../components/BottomSheet';
import type { BookmarkedWallet } from '../../stores';
import { useBookmarks, useBookmarksActions } from '../../stores';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
import { BookmarkAddressSheet } from './BookmarkAddressSheet';
import { EmptyListIndicator } from './EmptyListIndicator';
import { ListItem } from './ListItem';
import { navigationRoutes } from '../../utils';
import { useNavigate } from 'react-router-dom';

export const RecentWalletsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedRecent, setSelectedRecent] = useState<
    BookmarkedWallet | undefined
  >();
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null);
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const { recentWallets } = useBookmarks();
  const { removeRecentWallet, addBookmarkedWallet } = useBookmarksActions();

  const handleRecentSelected = (recentWallet: BookmarkedWallet) => {
    setSelectedRecent(recentWallet);
    confirmAddressSheetRef.current?.open();
  };

  const handleOpenBookmarkSheet = (recentWallet: BookmarkedWallet) => {
    setSelectedRecent(recentWallet);
    bookmarkAddressSheetRef.current?.open();
  };

  const handleAddBookmark = (name: string, address: string) => {
    addBookmarkedWallet(name, address);
    navigate(`../${navigationRoutes.bookmarkedWallets}`, {
      relative: 'path',
      replace: true,
    });
  };

  return (
    <SendToWalletPageContainer topBottomGutters>
      <ListContainer sx={{ minHeight: 418 }}>
        {recentWallets.map((recentWallet) => (
          <ListItem
            key={recentWallet.id}
            bookmark={recentWallet}
            onSelected={handleRecentSelected}
            onRemove={removeRecentWallet}
            onBookmark={handleOpenBookmarkSheet}
          />
        ))}
        {!recentWallets.length && (
          <EmptyListIndicator icon={<WalletIcon sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noRecentWallets')}
          </EmptyListIndicator>
        )}
      </ListContainer>
      <BookmarkAddressSheet
        ref={bookmarkAddressSheetRef}
        address={selectedRecent?.address}
        onAddBookmark={handleAddBookmark}
      />
      <ConfirmAddressSheet
        ref={confirmAddressSheetRef}
        address={selectedRecent?.address || ''}
      />
    </SendToWalletPageContainer>
  );
};
