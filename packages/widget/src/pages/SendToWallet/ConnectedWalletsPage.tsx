import {
  ContentCopyRounded,
  MoreHoriz,
  OpenInNewRounded,
  TurnedIn,
} from '@mui/icons-material';
import { ListItemAvatar, ListItemText, MenuItem } from '@mui/material';
import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountAvatar } from '../../components/AccountAvatar.js';
import type { BottomSheetBase } from '../../components/BottomSheet/types.js';
import { ListItem } from '../../components/ListItem/ListItem.js';
import { ListItemButton } from '../../components/ListItem/ListItemButton.js';
import { Menu } from '../../components/Menu.js';
import type { Account } from '../../hooks/useAccount.js';
import { useAccount } from '../../hooks/useAccount.js';
import { useChains } from '../../hooks/useChains.js';
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js';
import type { Bookmark } from '../../stores/bookmarks/types.js';
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js';
import { shortenAddress } from '../../utils/wallet.js';
import { ConfirmAddressSheet } from './ConfirmAddressSheet.js';
import { EmptyListIndicator } from './EmptyListIndicator.js';
import {
  ListContainer,
  OptionsMenuButton,
  SendToWalletPageContainer,
} from './SendToWalletPage.style.js';

export const ConnectedWalletsPage = () => {
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const { accounts } = useAccount();
  const { setSelectedBookmark } = useBookmarkActions();
  const { getChainById } = useChains();
  const { requiredToChainType } = useToAddressRequirements();
  const moreMenuId = useId();

  const handleWalletSelected = (account: Account) => {
    setSelectedAccount(account);
    confirmAddressSheetRef.current?.open();
  };

  const handleOnConfirm = (accountWallet: Bookmark) => {
    setSelectedBookmark(accountWallet);
  };

  const [moreMenuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>();
  const open = Boolean(moreMenuAnchorEl);
  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuOpen = (el: HTMLElement, connectedWallet: Account) => {
    setMenuAnchorEl(el);
    setSelectedAccount(connectedWallet);
  };

  const handleCopyAddress = () => {
    if (selectedAccount?.address) {
      navigator.clipboard.writeText(selectedAccount.address);
    }
    closeMenu();
  };

  const handleViewOnExplorer = () => {
    if (selectedAccount?.chainId) {
      const chain = getChainById(selectedAccount.chainId);
      window.open(
        `${chain?.metamask.blockExplorerUrls[0]}address/${selectedAccount.address}`,
        '_blank',
      );
    }
    closeMenu();
  };

  return (
    <SendToWalletPageContainer disableGutters>
      <ListContainer>
        {accounts.map((account) => {
          const walletAddress = shortenAddress(account.address);

          return (
            <ListItem key={account.address} sx={{ position: 'relative' }}>
              <ListItemButton
                onClick={() => handleWalletSelected(account)}
                disabled={
                  requiredToChainType &&
                  requiredToChainType !== account.chainType
                }
              >
                <ListItemAvatar>
                  <AccountAvatar chainId={account.chainId} account={account} />
                </ListItemAvatar>
                <ListItemText
                  primary={account.connector?.name}
                  secondary={walletAddress}
                />
              </ListItemButton>
              <OptionsMenuButton
                aria-label={t('button.options')}
                aria-controls={
                  open && account.address === selectedAccount?.address
                    ? moreMenuId
                    : undefined
                }
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(e) =>
                  handleMenuOpen(e.target as HTMLElement, account)
                }
                sx={{
                  opacity:
                    requiredToChainType &&
                    requiredToChainType !== account.chainType
                      ? 0.5
                      : 1,
                }}
              >
                <MoreHoriz fontSize="small" />
              </OptionsMenuButton>
            </ListItem>
          );
        })}
        {!accounts.length && (
          <EmptyListIndicator icon={<TurnedIn sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noConnectedWallets')}
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
            <ContentCopyRounded />
            {t('button.copyAddress')}
          </MenuItem>
          <MenuItem onClick={handleViewOnExplorer}>
            <OpenInNewRounded />
            {t('button.viewOnExplorer')}
          </MenuItem>
        </Menu>
      </ListContainer>
      <ConfirmAddressSheet
        ref={confirmAddressSheetRef}
        validatedBookmark={
          selectedAccount && {
            name: selectedAccount.connector?.name,
            address: selectedAccount.address!,
            chainType: selectedAccount.chainType!,
            isConnectedAccount: true,
          }
        }
        onConfirm={handleOnConfirm}
      />
    </SendToWalletPageContainer>
  );
};
