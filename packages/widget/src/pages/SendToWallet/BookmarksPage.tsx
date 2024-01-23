import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { Button, ListItemAvatar, ListItemText, MenuItem } from '@mui/material';
import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountAvatar } from '../../components/AccountAvatar';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { ListItem, ListItemButton } from '../../components/ListItem';
import { Menu } from '../../components/Menu';
import { useChains, useToAddressRequirements } from '../../hooks';
import type { Bookmark } from '../../stores';
import { useBookmarkActions, useBookmarks } from '../../stores';
import { defaultChainIdsByType, shortenAddress } from '../../utils';
import { BookmarkAddressSheet } from './BookmarkAddressSheet';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
import { EmptyListIndicator } from './EmptyListIndicator';
import {
  BookmarkButtonContainer,
  ListContainer,
  OptionsMenuButton,
  SendToWalletPageContainer,
} from './SendToWalletPage.style';

export const BookmarksPage = () => {
  const { t } = useTranslation();
  const [bookmark, setBookmark] = useState<Bookmark>();
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null);
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const { bookmarks } = useBookmarks();
  const { requiredToChainType } = useToAddressRequirements();
  const { addBookmark, removeBookmark, setSelectedBookmark } =
    useBookmarkActions();
  const { getChainById } = useChains();

  const handleAddBookmark = () => {
    bookmarkAddressSheetRef.current?.open();
  };

  const handleBookmarkSelected = (bookmark: Bookmark) => {
    setBookmark(bookmark);
    confirmAddressSheetRef.current?.open();
  };

  const handleOnConfirm = (confirmedWallet: Bookmark) => {
    setSelectedBookmark(confirmedWallet);
  };

  const moreMenuId = useId();
  const [moreMenuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>();
  const open = Boolean(moreMenuAnchorEl);
  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuOpen = (el: HTMLElement, bookmark: Bookmark) => {
    setMenuAnchorEl(el);
    setBookmark(bookmark);
  };

  const handleCopyAddress = () => {
    if (bookmark) {
      navigator.clipboard.writeText(bookmark.address);
    }
    closeMenu();
  };

  const handleViewOnExplorer = () => {
    if (bookmark) {
      const chain = getChainById(defaultChainIdsByType[bookmark.chainType]);
      window.open(
        `${chain?.metamask.blockExplorerUrls[0]}address/${bookmark.address}`,
        '_blank',
      );
    }
    closeMenu();
  };

  const handleRemoveBookmark = () => {
    if (bookmark) {
      removeBookmark(bookmark.address);
    }
    closeMenu();
  };

  return (
    <SendToWalletPageContainer disableGutters>
      <ListContainer>
        {bookmarks.map((bookmark) => (
          <ListItem key={bookmark.address} sx={{ position: 'relative' }}>
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
                secondary={shortenAddress(bookmark.address)}
              />
            </ListItemButton>
            <OptionsMenuButton
              aria-label={t('button.options')}
              aria-controls={
                open && bookmark.address === bookmark?.address
                  ? moreMenuId
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={(e) => handleMenuOpen(e.target as HTMLElement, bookmark)}
              sx={{
                opacity:
                  requiredToChainType &&
                  requiredToChainType !== bookmark.chainType
                    ? 0.5
                    : 1,
              }}
            >
              <MoreHorizIcon fontSize="small" />
            </OptionsMenuButton>
          </ListItem>
        ))}
        {!bookmarks.length && (
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
          <MenuItem onClick={handleCopyAddress}>
            <ContentCopyIcon />
            {t('button.copyAddress')}
          </MenuItem>
          <MenuItem onClick={handleViewOnExplorer}>
            <OpenInNewIcon />
            {t('button.viewOnExplorer')}
          </MenuItem>
          <MenuItem onClick={handleRemoveBookmark}>
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
        onAddBookmark={addBookmark}
      />
      <ConfirmAddressSheet
        ref={confirmAddressSheetRef}
        validatedBookmark={bookmark}
        onConfirm={handleOnConfirm}
      />
    </SendToWalletPageContainer>
  );
};
