import { useId, useRef, useState } from 'react';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import {
  ListContainer,
  OptionsMenuButton,
  SendToWalletPageContainer,
} from './SendToWalletPage.style';
import { useTranslation } from 'react-i18next';
import type { BookmarkedWallet } from '../../stores';
import { defaultChainIdsByType, shortenAddress } from '../../utils';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
import { EmptyListIndicator } from './EmptyListIndicator';
import type { BottomSheetBase } from '../../components/BottomSheet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import type { Account } from '../../hooks';
import { useAccount, useChains, useToAddressRequirements } from '../../hooks';
import { AccountAvatar } from '../../components/AccountAvatar';
import { useBookmarksActions } from '../../stores';
import { ListItemAvatar, ListItemText, MenuItem } from '@mui/material';
import { ListItem, ListItemButton } from '../../components/ListItem';
import { Menu } from '../../components/Menu';
export const ConnectedWalletsPage = () => {
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const { accounts } = useAccount();
  const connectedWallets = accounts.filter((account) => account.isConnected);
  const { setSelectedBookmarkWallet } = useBookmarksActions();
  const { getChainById } = useChains();
  const { requiredToChainType } = useToAddressRequirements();

  const handleWalletSelected = (account: Account) => {
    setSelectedAccount(account);
    confirmAddressSheetRef.current?.open();
  };

  const handleOnConfirm = (accountWalletDetails: BookmarkedWallet) => {
    setSelectedBookmarkWallet(accountWalletDetails);
  };

  const moreMenuId = useId();
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
    if (selectedAccount) {
      const chain = getChainById(
        defaultChainIdsByType[selectedAccount.chainType],
      );
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
        {connectedWallets.map((account) => {
          const walletAddress = shortenAddress(account.address);

          return (
            <ListItem key={account.address} sx={{ position: 'relative' }}>
              <>
                <ListItemButton
                  onClick={() => handleWalletSelected(account)}
                  disabled={
                    requiredToChainType &&
                    requiredToChainType !== account.chainType
                  }
                >
                  <ListItemAvatar>
                    <AccountAvatar
                      chainId={account.chainId}
                      account={account}
                    />
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
                  disableRipple
                >
                  <MoreHorizIcon fontSize="small" />
                </OptionsMenuButton>
              </>
            </ListItem>
          );
        })}
        {!connectedWallets.length && (
          <EmptyListIndicator icon={<TurnedInIcon sx={{ fontSize: 48 }} />}>
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
          <MenuItem onClick={handleCopyAddress} disableRipple>
            <ContentCopyIcon />
            {t('button.copyAddress')}
          </MenuItem>
          <MenuItem onClick={handleViewOnExplorer} disableRipple>
            <OpenInNewIcon />
            {t('button.viewOnExplorer')}
          </MenuItem>
        </Menu>
      </ListContainer>
      <ConfirmAddressSheet
        ref={confirmAddressSheetRef}
        validatedWallet={
          selectedAccount && {
            name: selectedAccount.connector?.name,
            address: selectedAccount.address!,
            addressType: 'address',
            chainType: selectedAccount.chainType,
            isConnectedAccount: true,
          }
        }
        onConfirm={handleOnConfirm}
      />
    </SendToWalletPageContainer>
  );
};

// [
//   {
//     id: 'copyAddressMenuItem',
//     children: (
//       <>
//         <ContentCopyIcon />
//         {t('button.copyAddress')}
//       </>
//     ),
//     action: handleCopyAddress,
//   },
//   {
//     id: 'viewOnExplorerMenuItem',
//     children: (
//       <>
//         <OpenInNewIcon />
//         {t('button.viewOnExplorer')}
//       </>
//     ),
//     action: handleViewOnExplorer,
//   },
// ]
