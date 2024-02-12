import { Box, Drawer as MuiDrawer, styled } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
export const drawerWidth = 392;
export const drawerZIndex = 1501;
export const autocompletePopperZIndex = drawerZIndex + 1;
export const tooltipPopperZIndex = drawerZIndex + 2;

export const Drawer = styled(MuiDrawer)(({ open }) => ({
  width: drawerWidth,
  // NOTE: setting the zIndex seems to prevent clicks underneath where the
  //  draw was when closed - so we ony want to set eh zIndex when its open
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

export const DrawerContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: drawerWidth,
  padding: theme.spacing(3),
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(2),
  zIndex: 1200,
}));

export const TabContentContainer = styled(TabPanel)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(2),
  padding: 0,
}));
