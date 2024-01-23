import type { ChainType } from '@lifi/sdk';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import WalletIcon from '@mui/icons-material/Wallet';
import { ListItemAvatar, ListItemText, MenuItem } from '@mui/material';
import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AccountAvatar } from '../../components/AccountAvatar';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { ListItem, ListItemButton } from '../../components/ListItem';
import { Menu } from '../../components/Menu';
import { useChains, useToAddressRequirements } from '../../hooks';
import type { AddressType, Bookmark } from '../../stores';
import { useBookmarkActions, useBookmarks } from '../../stores';
import {
  defaultChainIdsByType,
  navigationRoutes,
  shortenAddress,
} from '../../utils';
import { BookmarkAddressSheet } from './BookmarkAddressSheet';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
import { EmptyListIndicator } from './EmptyListIndicator';
import {
  ListContainer,
  OptionsMenuButton,
  SendToWalletPageContainer,
} from './SendToWalletPage.style';

export const RecentWalletsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedRecent, setSelectedRecent] = useState<Bookmark>();
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null);
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const { recentWallets } = useBookmarks();
  const { requiredToChainType } = useToAddressRequirements();
  const {
    removeRecentWallet,
    addBookmark,
    setSelectedBookmark,
    addRecentWallet,
  } = useBookmarkActions();
  const { getChainById } = useChains();
  const moreMenuId = useId();
  const [moreMenuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>();
  const open = Boolean(moreMenuAnchorEl);

  const handleRecentSelected = (recentWallet: Bookmark) => {
    setSelectedRecent(recentWallet);
    confirmAddressSheetRef.current?.open();
  };

  const handleAddBookmark = (
    name: string,
    address: string,
    addressType: AddressType,
    chainType: ChainType,
  ) => {
    addBookmark(name, address, addressType, chainType);
    navigate(`../${navigationRoutes.bookmarks}`, {
      relative: 'path',
      replace: true,
    });
  };

  const handleOnConfirm = (confirmedWallet: Bookmark) => {
    setSelectedBookmark(confirmedWallet);
    addRecentWallet(
      confirmedWallet.address,
      confirmedWallet.addressType,
      confirmedWallet.chainType,
    );
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuOpen = (el: HTMLElement, recentWallet: Bookmark) => {
    setMenuAnchorEl(el);
    setSelectedRecent(recentWallet);
  };

  const handleCopyAddress = () => {
    if (selectedRecent) {
      navigator.clipboard.writeText(selectedRecent.address);
    }
    closeMenu();
  };

  const handleViewOnExplorer = () => {
    if (selectedRecent) {
      const chain = getChainById(
        defaultChainIdsByType[selectedRecent.chainType],
      );
      window.open(
        `${chain?.metamask.blockExplorerUrls[0]}address/${selectedRecent.address}`,
        '_blank',
      );
    }
    closeMenu();
  };

  const handleOpenBookmarkSheet = () => {
    if (selectedRecent) {
      setSelectedRecent(selectedRecent);
      bookmarkAddressSheetRef.current?.open();
    }
    closeMenu();
  };

  const handleRemoveRecentWallet = () => {
    if (selectedRecent) {
      removeRecentWallet(selectedRecent);
    }
    closeMenu();
  };

  return (
    <SendToWalletPageContainer disableGutters>
      <ListContainer sx={{ minHeight: 418 }}>
        {recentWallets.map((recentWallet) => (
          <ListItem key={recentWallet.address} sx={{ position: 'relative' }}>
            <ListItemButton
              disabled={
                requiredToChainType &&
                requiredToChainType !== recentWallet.chainType
              }
              onClick={() => handleRecentSelected(recentWallet)}
            >
              <ListItemAvatar>
                <AccountAvatar
                  chainId={defaultChainIdsByType[recentWallet.chainType]}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  recentWallet.addressType === 'address'
                    ? shortenAddress(recentWallet.address)
                    : recentWallet.address
                }
              />
            </ListItemButton>
            <OptionsMenuButton
              aria-label={t('button.options')}
              aria-controls={
                open && recentWallet.address === selectedRecent?.address
                  ? moreMenuId
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={(e) =>
                handleMenuOpen(e.target as HTMLElement, recentWallet)
              }
              sx={{
                opacity:
                  requiredToChainType &&
                  requiredToChainType !== recentWallet.chainType
                    ? 0.5
                    : 1,
              }}
            >
              <MoreHorizIcon fontSize="small" />
            </OptionsMenuButton>
          </ListItem>
        ))}
        {!recentWallets.length && (
          <EmptyListIndicator icon={<WalletIcon sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noRecentWallets')}
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
          <MenuItem onClick={handleOpenBookmarkSheet}>
            <TurnedInIcon />
            {t('button.bookmark')}
          </MenuItem>
          <MenuItem onClick={handleRemoveRecentWallet}>
            <DeleteIcon />
            {t('button.delete')}
          </MenuItem>
        </Menu>
      </ListContainer>
      <BookmarkAddressSheet
        ref={bookmarkAddressSheetRef}
        validatedWallet={selectedRecent}
        onAddBookmark={handleAddBookmark}
      />
      <ConfirmAddressSheet
        ref={confirmAddressSheetRef}
        validatedWallet={selectedRecent}
        onConfirm={handleOnConfirm}
      />
    </SendToWalletPageContainer>
  );
};
