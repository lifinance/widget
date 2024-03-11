import type {
  ButtonBaseProps,
  DrawerProps as MuiDrawerProps,
} from '@mui/material';
import {
  Box,
  ButtonBase,
  Drawer as MuiDrawer,
  IconButton,
  styled,
} from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
export const drawerZIndex = 1501;
export const autocompletePopperZIndex = drawerZIndex + 1;
export const tooltipPopperZIndex = drawerZIndex + 2;
export const popperZIndex = drawerZIndex + 3;

interface DrawerProps extends MuiDrawerProps {
  drawerWidth: number;
}
export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => !['drawerWidth'].includes(prop as string),
})<DrawerProps>(({ open, drawerWidth }) => ({
  width: drawerWidth,
  // NOTE: setting the zIndex seems to prevent clicks underneath where the
  //  draw was when closed - so we ony want to see the zIndex when its open
  ...(open ? { zIndex: drawerZIndex } : {}),
}));

export const Header = styled('h1')({
  fontSize: '1.5em',
  margin: 0,
  lineHeight: 0.8,
});

export const HeaderRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const DrawerContentContainer = styled(Box, {
  shouldForwardProp: (prop) => !['drawerWidth'].includes(prop as string),
})<{
  drawerWidth: number;
}>(({ theme, drawerWidth }) => ({
  display: 'flex',
  width: drawerWidth,
  padding: theme.spacing(3),
  flexDirection: 'column',
  flexGrow: 1,
  gap: theme.spacing(2),
  zIndex: 1200,
}));

export const TabContentContainer = styled(TabPanel)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(2),
  padding: 0,
  '&[hidden]': {
    display: 'none',
  },
}));

export const CodeContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
}));

export const CodeCopyButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(0.5),
  background:
    theme.palette.mode === 'light'
      ? theme.palette.grey[200]
      : theme.palette.grey[800],
  '&:hover': {
    background:
      theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
  },
  zIndex: tooltipPopperZIndex,
}));

export const Pre = styled('pre')(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[200]
      : theme.palette.grey[800],
  margin: 0,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius - 4,
  overflowX: 'scroll',
}));

export const Code = styled('code')(({ theme }) => ({
  fontFamily: 'Courier, monospace',
  fontSize: '0.8em',
}));

export const DrawerHandleButton = styled((props: ButtonBaseProps) => (
  <ButtonBase {...props} disableRipple>
    &nbsp;
  </ButtonBase>
))({
  background: 'none',
  color: 'inherit',
  border: 'none',
  font: 'inherit',
  outline: 'inherit',
  height: '100%',
  cursor: 'col-resize',
  position: 'fixed',
  transform: 'translateX(-8px)',
  zIndex: drawerZIndex + 1,
});
