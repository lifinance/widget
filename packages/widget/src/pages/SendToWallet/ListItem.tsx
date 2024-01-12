import { useTranslation } from 'react-i18next';
import { PropsWithChildren, useId, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@mui/material/MenuItem';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import type { BookmarkedWallet } from '../../stores';
import {
  ListItemContainer,
  ListItemInfoContainer,
  ListItemMenuButton,
  ListMenu,
} from './SendToWalletPage.style';
import { ListItemButton } from '../../components/ListItemButton';
import { useChains, useAvailableChains } from '../../hooks';

interface ListItemProps extends PropsWithChildren {
  bookmark: BookmarkedWallet;
  onSelected: (bookmark: BookmarkedWallet) => void;
  onBookmark?: (bookmark: BookmarkedWallet) => void;
  onRemove?: (bookmark: BookmarkedWallet) => void;
}

export const ListItem = ({
  bookmark,
  onSelected,
  onBookmark,
  onRemove,
  children,
}: ListItemProps) => {
  const { t } = useTranslation();
  const moreButtonId = useId();
  const moreMenuId = useId();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { getFirstOfChainType } = useChains();

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
    const chain = getFirstOfChainType(bookmark.chainType);
    window.open(
      `${chain?.metamask.blockExplorerUrls[0]}address/${bookmark.address}`,
      '_blank',
    );
    closeMenu();
  };

  const handleRemoveBookmark = () => {
    onRemove && onRemove(bookmark);
    closeMenu();
  };

  const handleAddBookmark = () => {
    // open the bookmark sheet
    onBookmark && onBookmark(bookmark);
    closeMenu();
  };

  const handleSelected = () => {
    onSelected(bookmark);
  };

  return (
    <ListItemContainer>
      <ListItemButton
        sx={{ display: 'flex', justifyContent: 'space-between' }}
        onClick={handleSelected}
        disableRipple
      >
        <ListItemInfoContainer>{children}</ListItemInfoContainer>
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
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
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
        {onBookmark && (
          <MenuItem onClick={handleAddBookmark} disableRipple>
            <TurnedInIcon />
            {t('button.bookmark')}
          </MenuItem>
        )}
        {onRemove && (
          <MenuItem onClick={handleRemoveBookmark} disableRipple>
            <DeleteIcon />
            {t('button.remove')}
          </MenuItem>
        )}
      </ListMenu>
    </ListItemContainer>
  );
};
