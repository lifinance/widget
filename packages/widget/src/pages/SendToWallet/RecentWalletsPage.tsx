import { useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ChainType } from '@lifi/sdk';
import WalletIcon from '@mui/icons-material/Wallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  ListContainer,
  OptionsMenuButton,
  SendToWalletPageContainer,
} from './SendToWalletPage.style';
import type { AddressType, BookmarkedWallet } from '../../stores';
import { useBookmarks, useBookmarksActions } from '../../stores';
import {
  defaultChainIdsByType,
  navigationRoutes,
  shortenAddress,
} from '../../utils';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { AccountAvatar } from '../../components/AccountAvatar';
import { useChains, useToAddressRequirements } from '../../hooks';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
import { BookmarkAddressSheet } from './BookmarkAddressSheet';
import { EmptyListIndicator } from './EmptyListIndicator';
import { ListItemAvatar, ListItemText, MenuItem } from '@mui/material';
import { ListItem, ListItemButton } from '../../components/ListItem';
import { Menu } from '../../components/Menu';

export const RecentWalletsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedRecent, setSelectedRecent] = useState<
    BookmarkedWallet | undefined
  >();
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null);
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const { recentWallets } = useBookmarks();
  const { requiredToChainType } = useToAddressRequirements();
  const {
    removeRecentWallet,
    addBookmarkedWallet,
    setSelectedBookmarkWallet,
    addRecentWallet,
  } = useBookmarksActions();
  const { getChainById } = useChains();

  const handleRecentSelected = (recentWallet: BookmarkedWallet) => {
    setSelectedRecent(recentWallet);
    confirmAddressSheetRef.current?.open();
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

  const handleOnConfirm = (confirmedWallet: BookmarkedWallet) => {
    setSelectedBookmarkWallet(confirmedWallet);
    addRecentWallet(
      confirmedWallet.address,
      confirmedWallet.addressType,
      confirmedWallet.chainType,
    );
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
    setSelectedRecent(bookmarkedWallet);
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
            <>
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
                disableRipple
              >
                <MoreHorizIcon fontSize="small" />
              </OptionsMenuButton>
            </>
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
          <MenuItem onClick={handleCopyAddress} disableRipple>
            <ContentCopyIcon />
            {t('button.copyAddress')}
          </MenuItem>
          <MenuItem onClick={handleViewOnExplorer} disableRipple>
            <OpenInNewIcon />
            {t('button.viewOnExplorer')}
          </MenuItem>
          <MenuItem onClick={handleOpenBookmarkSheet} disableRipple>
            <TurnedInIcon />
            {t('button.bookmark')}
          </MenuItem>
          <MenuItem onClick={handleRemoveRecentWallet} disableRipple>
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
