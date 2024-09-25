import {
  alpha,
  ListItemButton as MuiListItemButton,
  styled,
} from '@mui/material';

export const ListItemButton = styled(MuiListItemButton)(({
  theme,
  disabled,
}) => {
  const backgroundHoverColor =
    theme.palette.mode === 'light'
      ? alpha(theme.palette.common.black, 0.04)
      : alpha(theme.palette.common.white, 0.04);
  return {
    borderRadius: theme.shape.borderRadius,
    paddingLeft: theme.spacing(1.5),
    height: 56,
    '&:hover': {
      backgroundColor: !disabled && backgroundHoverColor,
    },
    ...(disabled ? { opacity: 0.5, cursor: 'auto' } : {}),
  };
});
