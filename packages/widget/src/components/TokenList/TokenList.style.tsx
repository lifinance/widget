import type { IconButtonProps, LinkProps } from '@mui/material';
import { IconButton as MuiIconButton } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
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
      backgroundColor:
        theme.palette.mode === 'light'
          ? alpha(theme.palette.common.black, 0.04)
          : alpha(theme.palette.common.white, 0.08),
    },
    svg: {
      fontSize: 14,
    },
  }),
);
