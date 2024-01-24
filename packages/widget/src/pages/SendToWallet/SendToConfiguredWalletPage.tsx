import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ListItemAvatar, ListItemText, MenuItem } from '@mui/material';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AccountAvatar } from '../../components/AccountAvatar';
import { ListItem, ListItemButton } from '../../components/ListItem';
import { Menu } from '../../components/Menu';
import { useChains, useToAddressRequirements } from '../../hooks';
import type { Bookmark } from '../../stores';
import { useBookmarkActions, useBookmarks } from '../../stores';
import {
  defaultChainIdsByType,
  navigationRoutes,
  shortenAddress,
} from '../../utils';
import {
  ListContainer,
  OptionsMenuButton,
  SendToWalletPageContainer,
} from './SendToWalletPage.style';

export const SendToConfiguredWalletPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedConfiguredWallet, setSelectedConfiguredWallet] =
    useState<Bookmark>();
  const { recentWallets: configuredWallets } = useBookmarks();
  const { requiredToChainType } = useToAddressRequirements();
  const { setSelectedBookmark } = useBookmarkActions();
  const { getChainById } = useChains();
  const moreMenuId = useId();
  const [moreMenuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>();
  const open = Boolean(moreMenuAnchorEl);

  const handleCuratedSelected = (configuredWallet: Bookmark) => {
    setSelectedBookmark(configuredWallet);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuOpen = (el: HTMLElement, configuredWallet: Bookmark) => {
    setMenuAnchorEl(el);
    setSelectedConfiguredWallet(configuredWallet);
  };

  const handleCopyAddress = () => {
    if (selectedConfiguredWallet) {
      navigator.clipboard.writeText(selectedConfiguredWallet.address);
    }
    closeMenu();
  };

  const handleViewOnExplorer = () => {
    if (selectedConfiguredWallet) {
      const chain = getChainById(
        defaultChainIdsByType[selectedConfiguredWallet.chainType],
      );
      window.open(
        `${chain?.metamask.blockExplorerUrls[0]}address/${selectedConfiguredWallet.address}`,
        '_blank',
      );
    }
    closeMenu();
  };

  return (
    <SendToWalletPageContainer disableGutters>
      <ListContainer sx={{ minHeight: 418 }}>
        {configuredWallets.map((configredWallet) => (
          <ListItem key={configredWallet.address} sx={{ position: 'relative' }}>
            <ListItemButton
              disabled={
                requiredToChainType &&
                requiredToChainType !== configredWallet.chainType
              }
              onClick={() => handleCuratedSelected(configredWallet)}
            >
              <ListItemAvatar>
                <AccountAvatar
                  chainId={defaultChainIdsByType[configredWallet.chainType]}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  configredWallet.name ||
                  shortenAddress(configredWallet.address)
                }
                secondary={
                  configredWallet.name
                    ? shortenAddress(configredWallet.address)
                    : undefined
                }
              />
            </ListItemButton>
            <OptionsMenuButton
              aria-label={t('button.options')}
              aria-controls={
                open &&
                configredWallet.address === selectedConfiguredWallet?.address
                  ? moreMenuId
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={(e) =>
                handleMenuOpen(e.target as HTMLElement, configredWallet)
              }
              sx={{
                opacity:
                  requiredToChainType &&
                  requiredToChainType !== configredWallet.chainType
                    ? 0.5
                    : 1,
              }}
            >
              <MoreHorizIcon fontSize="small" />
            </OptionsMenuButton>
          </ListItem>
        ))}
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
        </Menu>
      </ListContainer>
    </SendToWalletPageContainer>
  );
};
