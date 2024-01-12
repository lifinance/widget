import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ChainType } from '@lifi/sdk';
import WalletIcon from '@mui/icons-material/Wallet';
import {
  ListContainer,
  SendToWalletPageContainer,
} from './SendToWalletPage.style';
import type { AddressType, BookmarkedWallet } from '../../stores';
import { useBookmarks, useBookmarksActions } from '../../stores';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
import { BookmarkAddressSheet } from './BookmarkAddressSheet';
import { EmptyListIndicator } from './EmptyListIndicator';
import { ListItem } from './ListItem';
import { navigationRoutes, shortenAddress } from '../../utils';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { BookmarkName, WalletAvatar } from '../../components/SendToWallet';

export const RecentWalletsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedRecent, setSelectedRecent] = useState<
    BookmarkedWallet | undefined
  >();
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null);
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const { recentWallets } = useBookmarks();
  const {
    removeRecentWallet,
    addBookmarkedWallet,
    setSelectedBookmarkWallet,
    addRecentWallet,
  } = useBookmarksActions();

  const handleRecentSelected = (recentWallet: BookmarkedWallet) => {
    setSelectedRecent(recentWallet);
    confirmAddressSheetRef.current?.open();
  };

  const handleOpenBookmarkSheet = (recentWallet: BookmarkedWallet) => {
    setSelectedRecent(recentWallet);
    bookmarkAddressSheetRef.current?.open();
  };

  const handleAddBookmark = (
    name: string,
    address: string,
    addressType: AddressType,
    chainType: ChainType,
  ) => {
    addBookmarkedWallet(name, address, addressType, chainType);
    navigate(`../${navigationRoutes.bookmarkedWallets}`, {
      relative: 'path',
      replace: true,
    });
  };

  const handleOnConfirm = () => {
    setSelectedBookmarkWallet();
    addRecentWallet(
      selectedRecent!.address,
      selectedRecent!.addressType,
      selectedRecent!.chainType,
    );
  };

  return (
    <SendToWalletPageContainer disableGutters>
      <ListContainer sx={{ minHeight: 418 }}>
        {recentWallets.map((recentWallet) => (
          <ListItem
            key={recentWallet.address}
            bookmark={recentWallet}
            onSelected={handleRecentSelected}
            onRemove={removeRecentWallet}
            onBookmark={handleOpenBookmarkSheet}
          >
            <WalletAvatar />
            <BookmarkName>
              {recentWallet.addressType === 'address'
                ? shortenAddress(recentWallet.address)
                : recentWallet.address}
            </BookmarkName>
          </ListItem>
        ))}
        {!recentWallets.length && (
          <EmptyListIndicator icon={<WalletIcon sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noRecentWallets')}
          </EmptyListIndicator>
        )}
      </ListContainer>
      <BookmarkAddressSheet
        ref={bookmarkAddressSheetRef}
        validatedWallet={selectedRecent}
        onAddBookmark={handleAddBookmark}
      />
      {selectedRecent && (
        <ConfirmAddressSheet
          ref={confirmAddressSheetRef}
          validatedWallet={selectedRecent}
          onConfirm={handleOnConfirm}
        />
      )}
    </SendToWalletPageContainer>
  );
};
