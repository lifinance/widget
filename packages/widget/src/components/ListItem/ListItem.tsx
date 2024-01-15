import { useTranslation } from 'react-i18next';
import { PropsWithChildren, ReactNode, useId, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@mui/material/MenuItem';
import {
  ListItemContainer,
  ListItemInfoContainer,
  ListItemMenuButton,
  ListMenu,
} from './ListItem.style';
import { ListItemButton } from '../ListItemButton';

interface MenuItem<ItemData> {
  id: string;
  children: ReactNode;
  action: (payload: ItemData) => void | (() => void);
}

interface ListItemProps<ItemData> extends PropsWithChildren {
  itemData: ItemData;
  onSelected: (bookmark: ItemData) => void;
  menuItems?: MenuItem<ItemData>[];
}

export const ListItem = <ItemData extends unknown>({
  itemData,
  onSelected,
  menuItems,
  children,
}: ListItemProps<ItemData>) => {
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

  const handleSelected = () => {
    onSelected(itemData);
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
      {menuItems && (
        <>
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
            {menuItems.map((menuItem) => (
              <MenuItem
                key={menuItem.id}
                onClick={() => {
                  menuItem.action(itemData);
                  closeMenu();
                }}
                disableRipple
              >
                {menuItem.children}
              </MenuItem>
            ))}
          </ListMenu>
        </>
      )}
    </ListItemContainer>
  );
};
