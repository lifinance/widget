import { Box, Drawer as MuiDrawer, styled } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
export const drawerWidth = 392;
export const drawerZIndex = 1201;
export const Drawer = styled(MuiDrawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  zIndex: drawerZIndex,
}));

export const DrawerContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: drawerWidth,
  padding: theme.spacing(3),
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(3),
}));

export const TabContentContainer = styled(TabPanel)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(2),
  padding: 0,
}));
