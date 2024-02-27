import {
  AppBar,
  Avatar,
  Box,
  Button,
  alpha,
  buttonClasses,
  styled,
} from '@mui/material';
import { getContrastAlphaColor } from '../../utils/colors.js';
import { avatarMask12 } from '../Avatar/utils.js';
import { Tabs } from '../Tabs/Tabs.style.js';

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
    backgroundColor: getContrastAlphaColor(theme, 0.04),
  },
  [`.${buttonClasses.endIcon} > *:nth-of-type(1)`]: {
    fontSize: '24px',
  },
  [`.${buttonClasses.startIcon} > *:nth-of-type(1)`]: {
    fontSize: '24px',
  },
}));

export const DrawerWalletContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',

  '& button:first-of-type': {
    marginLeft: theme.spacing(-1),
  },
  '& button:last-of-type': {
    marginRight: theme.spacing(-1.25),
  },
}));

export const HeaderControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  '& button:last-of-type': {
    marginRight: theme.spacing(-1.25),
  },
}));

export const SplitTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.common.black, 0.04)
      : theme.palette.background.paper,
}));

export const WalletAvatar = styled(Avatar)(({ theme }) => ({
  mask: avatarMask12,
  width: 24,
  height: 24,
}));
