import { AppBar, Box, Button } from '@mui/material';
import { buttonClasses } from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';

export const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  minHeight: 40,
  padding: theme.spacing(0, 3, 0, 3),
  ':first-of-type': {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(0.5),
  },
}));

export const Container = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sticky',
})<{ sticky?: boolean }>(({ theme, sticky }) => ({
  backgroundColor: theme.palette.background.default,
  backdropFilter: 'blur(12px)',
  position: sticky ? 'sticky' : 'relative',
  top: 0,
  zIndex: 1200,
}));

export const WalletButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: 'transparent',
  padding: theme.spacing(1, 1.5),
  maxHeight: 40,
  fontSize: '0.875rem',
  fontWeight: 600,
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

export const DrawerWalletContainer = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyItems: 'start',

  '& > button': {
    marginLeft: '-0.5rem',
  },
}));
