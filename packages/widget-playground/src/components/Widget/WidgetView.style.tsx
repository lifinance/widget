import { alpha, styled } from '@mui/material/styles';
import type { Theme } from '@mui/material';
import { Box, Button, IconButton } from '@mui/material';
import { drawerWidth, drawerZIndex } from '../DrawerControls';
import { buttonClasses } from '@mui/material/Button';

export const FloatingToolsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  position: 'absolute',
  zIndex: drawerZIndex,
  top: theme.spacing(3),
  left: theme.spacing(3),
}));

export const WidgetContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  paddingTop: theme.spacing(6),
}));

const floatingToolButtonColors = (theme: Theme) => ({
  color: theme.palette.text.primary,
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.grey[900],
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.common.black, 0.04)
        : alpha(theme.palette.common.white, 0.08),
  },
});

export const DrawerOpenButton = styled(IconButton)(({ theme }) => ({
  ...floatingToolButtonColors(theme),
  boxShadow: `0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)`,
}));

export const ConnectionWalletButtonBase = styled(Button)(({ theme }) => ({
  ...floatingToolButtonColors(theme),
  minHeight: 40,
  fontSize: '0.875rem',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius * 2,
  [`.${buttonClasses.endIcon} > *:nth-of-type(1)`]: {
    fontSize: '24px',
  },
  [`.${buttonClasses.startIcon} > *:nth-of-type(1)`]: {
    fontSize: '24px',
  },
}));

export const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  display: 'flex',
  justifyContent: 'stretch',
  position: 'relative',
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));
