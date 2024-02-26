import type { IconButtonProps, LinkProps } from '@mui/material';
import { IconButton as MuiIconButton, styled } from '@mui/material';
import { getContrastAlphaColor } from '../../utils/colors.js';
import { ListItem as ListItemBase } from '../ListItem/ListItem.js';

export const ListItem = styled(ListItemBase)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
}));

export const IconButton = styled(MuiIconButton)<IconButtonProps & LinkProps>(
  ({ theme }) => ({
    lineHeight: 1,
    fontSize: 12,
    fontWeight: 400,
    padding: theme.spacing(0.375, 0.375),
    margin: theme.spacing(0, 0, 0, 0.25),
    color: 'inherit',
    backgroundColor: 'unset',
    minWidth: 'unset',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: getContrastAlphaColor(theme, 0.04),
    },
    svg: {
      fontSize: 14,
    },
  }),
);
