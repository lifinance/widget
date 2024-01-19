import { useId, useRef, useState } from 'react';
import { Button, ListItemAvatar, ListItemText, MenuItem } from '@mui/material';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useTranslation } from 'react-i18next';
import type { BookmarkedWallet } from '../../stores';
import { useBookmarks, useBookmarksActions } from '../../stores';
import { defaultChainIdsByType, shortenAddress } from '../../utils';
import { BookmarkAddressSheet } from './BookmarkAddressSheet';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
import { EmptyListIndicator } from './EmptyListIndicator';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { AccountAvatar } from '../../components/AccountAvatar';
import { useChains, useToAddressRequirements } from '../../hooks';
import {
  BookmarkButtonContainer,
  ListContainer,
  SendToWalletPageContainer,
  OptionsMenuButton,
} from './SendToWalletPage.style';
import { Menu } from '../../components/Menu';
import { ListItem, ListItemButton } from '../../components/ListItem';
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

  const handleBookmarkSelected = (bookmarkedWallet: BookmarkedWallet) => {
    setSelectedBookmark(bookmarkedWallet);
    confirmAddressSheetRef.current?.open();
  };

  const handleOnConfirm = (confirmedWallet: BookmarkedWallet) => {
    setSelectedBookmarkWallet(confirmedWallet);
  };

  const moreMenuId = useId();
  const [moreMenuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>();
  const open = Boolean(moreMenuAnchorEl);
  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuOpen = (
    el: HTMLElement,
    bookmarkedWallet: BookmarkedWallet,
  ) => {
    setMenuAnchorEl(el);
    setSelectedBookmark(bookmarkedWallet);
  };

  const handleCopyAddress = () => {
    if (selectedBookmark) {
      navigator.clipboard.writeText(selectedBookmark.address);
    }
    closeMenu();
  };

  const handleViewOnExplorer = () => {
    if (selectedBookmark) {
      const chain = getChainById(
        defaultChainIdsByType[selectedBookmark.chainType],
      );
      window.open(
        `${chain?.metamask.blockExplorerUrls[0]}address/${selectedBookmark.address}`,
        '_blank',
      );
    }
    closeMenu();
  };

  const handleRemoveBookmark = () => {
    if (selectedBookmark) {
      removeBookmarkedWallet(selectedBookmark);
    }
    closeMenu();
  };

  return (
    <SendToWalletPageContainer disableGutters>
      <ListContainer>
        {bookmarkedWallets.map((bookmark) => (
          <ListItem key={bookmark.address} sx={{ position: 'relative' }}>
            <>
              <ListItemButton
                onClick={() => handleBookmarkSelected(bookmark)}
                disabled={
                  requiredToChainType &&
                  requiredToChainType !== bookmark.chainType
                }
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
              </ListItemButton>
              <OptionsMenuButton
                aria-label={t('button.options')}
                aria-controls={
                  open && bookmark.address === selectedBookmark?.address
                    ? moreMenuId
                    : undefined
                }
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(e) =>
                  handleMenuOpen(e.target as HTMLElement, bookmark)
                }
                sx={{
                  opacity:
                    requiredToChainType &&
                    requiredToChainType !== bookmark.chainType
                      ? 0.5
                      : 1,
                }}
                disableRipple
              >
                <MoreHorizIcon fontSize="small" />
              </OptionsMenuButton>
            </>
          </ListItem>
        ))}
        {!bookmarkedWallets.length && (
          <EmptyListIndicator icon={<TurnedInIcon sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noBookmarkedWallets')}
          </EmptyListIndicator>
        )}
        <Menu
          id={moreMenuId}
          elevation={0}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          anchorEl={moreMenuAnchorEl}
          open={open}
          onClose={closeMenu}
        >
          <MenuItem onClick={handleCopyAddress} disableRipple>
            <ContentCopyIcon />
            {t('button.copyAddress')}
          </MenuItem>
          <MenuItem onClick={handleViewOnExplorer} disableRipple>
            <OpenInNewIcon />
            {t('button.viewOnExplorer')}
          </MenuItem>
          <MenuItem onClick={handleRemoveBookmark} disableRipple>
            <DeleteIcon />
            {t('button.delete')}
          </MenuItem>
        </Menu>
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
