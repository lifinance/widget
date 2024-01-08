import type { PropsWithChildren, ReactNode } from 'react';
import { useId, useRef, useState } from 'react';
import { Button } from '@mui/material';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import {
  BookmarkAddress,
  BookmarkItemContainer,
  BookmarkName,
} from '../../components/SendToWallet/SendToWallet.style';
import { WalletAvatar } from '../../components/SendToWallet';
import {
  EmptyContainer,
  EmptyListMessage,
  IconContainer,
  ListContainer,
  ListItemContainer,
  ListItemButton,
  ListItemMenuButton,
  SendToWalletPageContainer,
  ListMenu,
} from './SendToWalletPage.style';
import { PageContainer } from '../../components/PageContainer';
import { useTranslation } from 'react-i18next';
import { shortenAddress } from '../../utils';
import { BottomSheetBase } from '../../components/BottomSheet';
import { Bookmark, useBookmarks, useBookmarksActions } from '../../stores';
import { BookmarkAddressSheet } from './BookmarkAddressSheet';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
export const BookmarkedWalletsPage = () => {
  const { t } = useTranslation();
  const [selectedBookmark, setSelectedBookmark] = useState<
    Bookmark | undefined
  >();
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null);
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const { bookmarks } = useBookmarks();

  const handleAddBookmark = () => {
    bookmarkAddressSheetRef.current?.open();
  };

  const handleBookmarkSelected = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark);
    confirmAddressSheetRef.current?.open();
  };

  return (
    <SendToWalletPageContainer topBottomGutters>
      <ListContainer>
        {bookmarks.map((bookmark) => (
          <ListItem
            key={bookmark.id}
            bookmark={bookmark}
            onSelected={handleBookmarkSelected}
          />
        ))}
        {!bookmarks.length && (
          <EmptyList icon={<TurnedInIcon sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noBookmarkedWallets')}
          </EmptyList>
        )}
      </ListContainer>
      <Button variant="contained" onClick={handleAddBookmark}>
        {t('sendToWallet.addBookmark')}
      </Button>
      <BookmarkAddressSheet ref={bookmarkAddressSheetRef} />
      <ConfirmAddressSheet
        ref={confirmAddressSheetRef}
        address={selectedBookmark?.address || ''}
        bookmark={selectedBookmark}
      />
    </SendToWalletPageContainer>
  );
};

interface ListItemProps {
  bookmark: Bookmark;
  onSelected: (bookmark: Bookmark) => void;
}

const ListItem = ({ bookmark, onSelected }: ListItemProps) => {
  const { t } = useTranslation();
  const moreButtonId = useId();
  const moreMenuId = useId();
  const { removeBookmark } = useBookmarksActions();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(bookmark.address);
    closeMenu();
  };

  const handleViewOnExplorer = () => {
    // TODO: Question: not sure about what the url should be that the adress gets added too
    //  it looks like the WalletMenu is getting the accounts and chains info and then
    //  doing something like ${chain?.metamask.blockExplorerUrls[0]}address/${account.address}`
    //  but not sure if I should be doing that here or how I should be getting the url
    window.open('http://www.google.com', '_blank');
    closeMenu();
  };

  const handleRemoveBookmark = () => {
    removeBookmark(bookmark);
    closeMenu();
  };

  const handleSelected = () => {
    onSelected(bookmark);
  };

  return (
    <ListItemContainer>
      <ListItemButton onClick={handleSelected} disableRipple>
        <WalletAvatar />
        <BookmarkItemContainer>
          <BookmarkName>{bookmark.name}</BookmarkName>
          <BookmarkAddress>{shortenAddress(bookmark.address)}</BookmarkAddress>
        </BookmarkItemContainer>
      </ListItemButton>
      <ListItemMenuButton
        aria-label={t('button.options')}
        id={moreButtonId}
        aria-controls={open ? moreMenuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleMenuOpen}
        disableRipple
      >
        <MoreHorizIcon fontSize="small" />
      </ListItemMenuButton>
      <ListMenu
        id={moreMenuId}
        MenuListProps={{
          'aria-labelledby': moreButtonId,
        }}
        anchorEl={anchorEl}
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
          {t('button.remove')}
        </MenuItem>
      </ListMenu>
    </ListItemContainer>
  );
};

interface EmptyListProps extends PropsWithChildren {
  icon: ReactNode;
}

const EmptyList = ({ icon, children }: EmptyListProps) => (
  <EmptyContainer>
    <IconContainer>{icon}</IconContainer>
    <EmptyListMessage>{children}</EmptyListMessage>
  </EmptyContainer>
);
