import { alpha, styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { drawerZIndex } from '@/app/components/DrawerControls';
import { buttonClasses } from '@mui/material/Button';

export const ConnectionWalletButtonBase = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor:
    theme.palette.mode === 'light'
      ? 'transparent'
      : alpha(theme.palette.common.white, 0.16),
  padding: theme.spacing(1, 1.5),
  maxHeight: 40,
  fontSize: '0.875rem',
  fontWeight: 600,
  textTransform: 'none',
  position: 'relative',
  zIndex: drawerZIndex,
  borderRadius: theme.shape.borderRadius * 2,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.common.black, 0.04)
        : alpha(theme.palette.common.white, 0.08),
  },
  [`.${buttonClasses.endIcon} > *:nth-of-type(1)`]: {
    fontSize: '24px',
  },
  [`.${buttonClasses.startIcon} > *:nth-of-type(1)`]: {
    fontSize: '24px',
  },
}));
