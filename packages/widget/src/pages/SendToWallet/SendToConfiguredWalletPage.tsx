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
import { useBookmarkActions, useFieldActions } from '../../stores';
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
import { useWidgetConfig } from '../../providers';
import type { ToAddress } from '../../types';

export const SendToConfiguredWalletPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toAddresses } = useWidgetConfig();
  const [selectedToAddress, setSelectedToAddress] = useState<ToAddress>();
  const { requiredToChainType } = useToAddressRequirements();
  const { setSelectedBookmark } = useBookmarkActions();
  const { setFieldValue } = useFieldActions();
  const { getChainById } = useChains();
  const moreMenuId = useId();
  const [moreMenuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>();
  const open = Boolean(moreMenuAnchorEl);

  const handleCuratedSelected = (toAddress: ToAddress) => {
    setSelectedBookmark(toAddress);
    setFieldValue('toAddress', toAddress.address);
    navigate(navigationRoutes.home);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuOpen = (el: HTMLElement, toAddress: ToAddress) => {
    setMenuAnchorEl(el);
    setSelectedToAddress(toAddress);
  };

  const handleCopyAddress = () => {
    if (selectedToAddress) {
      navigator.clipboard.writeText(selectedToAddress.address);
    }
    closeMenu();
  };

  const handleViewOnExplorer = () => {
    if (selectedToAddress) {
      const chain = getChainById(
        defaultChainIdsByType[selectedToAddress.chainType],
      );
      window.open(
        `${chain?.metamask.blockExplorerUrls[0]}address/${selectedToAddress.address}`,
        '_blank',
      );
    }
    closeMenu();
  };

  return (
    <SendToWalletPageContainer disableGutters>
      <ListContainer sx={{ minHeight: 418 }}>
        {toAddresses?.map((toAddress) => (
          <ListItem key={toAddress.address} sx={{ position: 'relative' }}>
            <ListItemButton
              disabled={
                requiredToChainType &&
                requiredToChainType !== toAddress.chainType
              }
              onClick={() => handleCuratedSelected(toAddress)}
            >
              <ListItemAvatar>
                <AccountAvatar
                  chainId={defaultChainIdsByType[toAddress.chainType]}
                />
              </ListItemAvatar>
              <ListItemText
                primary={toAddress.name || shortenAddress(toAddress.address)}
                secondary={
                  toAddress.name ? shortenAddress(toAddress.address) : undefined
                }
              />
            </ListItemButton>
            <OptionsMenuButton
              aria-label={t('button.options')}
              aria-controls={
                open && toAddress.address === selectedToAddress?.address
                  ? moreMenuId
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={(e) =>
                handleMenuOpen(e.target as HTMLElement, toAddress)
              }
              sx={{
                opacity:
                  requiredToChainType &&
                  requiredToChainType !== toAddress.chainType
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
