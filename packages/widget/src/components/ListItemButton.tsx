import { ListItemButton as MuiListItemButton, styled } from '@mui/material';
import { getContrastAlphaColor } from '../utils/colors.js';

export const ListItemButton = styled(MuiListItemButton)(
  ({ theme, disabled }) => ({
    borderRadius: theme.shape.borderRadius,
    paddingLeft: theme.spacing(1.5),
    height: 56,
    ...(disabled ? { opacity: 0.5, cursor: 'auto' } : {}),
    '&:hover': {
      backgroundColor:
        !disabled && getContrastAlphaColor(theme.palette.mode, '4%'),
    },
  }),
);
