import { useTranslation } from 'react-i18next';
import { useId, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@mui/material/MenuItem';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import type { BookmarkedWallet } from '../../stores';
import {
  WalletAvatar,
  BookmarkAddress,
  BookmarkItemContainer,
  BookmarkName,
} from '../../components/SendToWallet';
import { shortenAddress } from '../../utils';
import {
  ListItemButton,
  ListItemContainer,
  ListItemMenuButton,
  ListMenu,
} from './SendToWalletPage.style';

interface ListItemProps {
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
}: ListItemProps) => {
  const { t } = useTranslation();
  const moreButtonId = useId();
  const moreMenuId = useId();
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
    // TODO: Question: not sure about what the url should be that the address gets added too
    //  it looks like the WalletMenu is getting the accounts and chains info and then
    //  doing something like ${chain?.metamask.blockExplorerUrls[0]}address/${account.address}`
    //  but not sure if I should be doing that here or how I should be getting the url
    window.open('http://www.google.com', '_blank');
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

  const address = shortenAddress(bookmark.address);

  return (
    <ListItemContainer>
      <ListItemButton onClick={handleSelected} disableRipple>
        <WalletAvatar />
        {bookmark.name ? (
          <BookmarkItemContainer>
            <BookmarkName>{bookmark.name}</BookmarkName>
            <BookmarkAddress>{address}</BookmarkAddress>
          </BookmarkItemContainer>
        ) : (
          <BookmarkName>{address}</BookmarkName>
        )}
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
