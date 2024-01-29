import { Box, Drawer as MuiDrawer, styled } from '@mui/material';

export const drawerWidth = 392;
export const Drawer = styled(MuiDrawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
}));

export const DrawerContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: 344,
  padding: theme.spacing(3),
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(3),
}));

export const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: 344,
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(3),
}));
