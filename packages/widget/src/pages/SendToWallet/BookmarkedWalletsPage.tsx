import { useRef, useState } from 'react';
import { Button, ListItemAvatar, ListItemText } from '@mui/material';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import type { BookmarkedWallet } from '../../stores';
import { useBookmarks, useBookmarksActions } from '../../stores';
import { defaultChainIdsByType, shortenAddress } from '../../utils';
import { BookmarkAddressSheet } from './BookmarkAddressSheet';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
import { EmptyListIndicator } from './EmptyListIndicator';
import { ListItem } from '../../components/ListItem';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { AccountAvatar } from '../../components/AccountAvatar';
import { useChains, useToAddressRequirements } from '../../hooks';
import {
  BookmarkButtonContainer,
  ListContainer,
  SendToWalletPageContainer,
} from './SendToWalletPage.style';
export const BookmarkedWalletsPage = () => {
  const { t } = useTranslation();
  const [selectedBookmark, setSelectedBookmark] = useState<
    BookmarkedWallet | undefined
  >();
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null);
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const { bookmarkedWallets } = useBookmarks();
  const { requiredToChainType } = useToAddressRequirements();
  const {
    addBookmarkedWallet,
    removeBookmarkedWallet,
    setSelectedBookmarkWallet,
  } = useBookmarksActions();
  const { getChainById } = useChains();

  const handleAddBookmark = () => {
    bookmarkAddressSheetRef.current?.open();
  };

  const handleBookmarkSelected = (bookmark: BookmarkedWallet) => {
    setSelectedBookmark(bookmark);
    confirmAddressSheetRef.current?.open();
  };

  const handleOnConfirm = (bookmark: BookmarkedWallet) => {
    setSelectedBookmarkWallet(bookmark);
  };
  const handleCopyAddress = (bookmarkedWallet: BookmarkedWallet) => {
    navigator.clipboard.writeText(bookmarkedWallet.address);
  };

  const handleViewOnExplorer = (bookmarkedWallet: BookmarkedWallet) => {
    const chain = getChainById(
      defaultChainIdsByType[bookmarkedWallet.chainType],
    );
    window.open(
      `${chain?.metamask.blockExplorerUrls[0]}address/${bookmarkedWallet.address}`,
      '_blank',
    );
  };

  const handleRemoveBookmark = (bookmarkedWallet: BookmarkedWallet) => {
    removeBookmarkedWallet(bookmarkedWallet);
  };

  return (
    <SendToWalletPageContainer disableGutters>
      <ListContainer>
        {bookmarkedWallets.map((bookmark) => (
          <ListItem<BookmarkedWallet>
            key={bookmark.address}
            itemData={bookmark}
            disabled={
              requiredToChainType && requiredToChainType !== bookmark.chainType
            }
            onSelected={handleBookmarkSelected}
            menuItems={[
              {
                id: 'copyAddressMenuItem',
                children: (
                  <>
                    <ContentCopyIcon />
                    {t('button.copyAddress')}
                  </>
                ),
                action: handleCopyAddress,
              },
              {
                id: 'viewOnExplorerMenuItem',
                children: (
                  <>
                    <OpenInNewIcon />
                    {t('button.viewOnExplorer')}
                  </>
                ),
                action: handleViewOnExplorer,
              },
              {
                id: 'removeMenuItem',
                children: (
                  <>
                    <DeleteIcon />
                    {t('button.remove')}
                  </>
                ),
                action: handleRemoveBookmark,
              },
            ]}
          >
            <ListItemAvatar>
              <AccountAvatar
                chainId={defaultChainIdsByType[bookmark.chainType]}
              />
            </ListItemAvatar>
            <ListItemText
              primary={bookmark.name}
              secondary={
                bookmark.addressType === 'address'
                  ? shortenAddress(bookmark.address)
                  : bookmark.address
              }
            />
          </ListItem>
        ))}
        {!bookmarkedWallets.length && (
          <EmptyListIndicator icon={<TurnedInIcon sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noBookmarkedWallets')}
          </EmptyListIndicator>
        )}
      </ListContainer>
      <BookmarkButtonContainer>
        <Button variant="contained" onClick={handleAddBookmark}>
          {t('sendToWallet.addBookmark')}
        </Button>
      </BookmarkButtonContainer>
      <BookmarkAddressSheet
        ref={bookmarkAddressSheetRef}
        onAddBookmark={addBookmarkedWallet}
      />
      <ConfirmAddressSheet
        ref={confirmAddressSheetRef}
        validatedWallet={selectedBookmark}
        onConfirm={handleOnConfirm}
      />
    </SendToWalletPageContainer>
  );
};
