import TabPanel from '@mui/lab/TabPanel'
import type { DrawerProps as MuiDrawerProps } from '@mui/material'
import { Box, Drawer as MuiDrawer, styled } from '@mui/material'
import type React from 'react'

export const drawerZIndex = 1501
export const autocompletePopperZIndex: number = drawerZIndex + 1
export const tooltipPopperZIndex: number = drawerZIndex + 2
export const popperZIndex: number = drawerZIndex + 3

interface DrawerProps extends MuiDrawerProps {
  drawerWidth: number
}
export const Drawer: React.FC<
  React.ComponentProps<typeof MuiDrawer> & DrawerProps
> = styled(MuiDrawer, {
  shouldForwardProp: (prop) => !['drawerWidth'].includes(prop as string),
})<DrawerProps>(({ theme, drawerWidth }) => {
  const gap = theme.spacing(1.5)
  return {
    width: 0,
    flexShrink: 0,
    variants: [
      {
        props: ({ open }) => open,
        style: { zIndex: drawerZIndex },
      },
    ],
    '& .MuiDrawer-paper': {
      position: 'fixed',
      top: gap,
      left: gap,
      width: drawerWidth,
      height: `calc(100% - ${gap} - ${gap})`,
      borderRadius: theme.spacing(1.5),
      border: `1px solid ${theme.vars.palette.divider}`,
      boxShadow:
        '0 20px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      ...theme.applyStyles('dark', {
        boxShadow:
          '0 20px 40px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15)',
      }),
    },
  }
})

export const TabContentContainer: React.FC<
  React.ComponentProps<typeof TabPanel>
> = styled(TabPanel)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(2),
  flexGrow: 1,
  padding: 0,
  '&[hidden]': {
    display: 'none',
  },
}))

export type SidebarView =
  | 'nav'
  | 'mode'
  | 'variant'
  | 'height'
  | 'wallet'
  | 'developer'
  | 'themeEdit'

export const SidebarContainer: React.FC<
  React.ComponentProps<typeof Box> & { drawerWidth: number }
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'drawerWidth',
})<{ drawerWidth: number }>(({ drawerWidth }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: drawerWidth,
  height: '100%',
  overflow: 'hidden',
}))

export const SidebarViewTrack: React.FC<
  React.ComponentProps<typeof Box> & { activeView: SidebarView }
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'activeView',
})<{ activeView: SidebarView }>(({ theme, activeView }) => ({
  display: 'flex',
  flex: '1 0 0',
  minHeight: 0,
  width: '200%',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.sharp,
  }),
  transform: activeView === 'nav' ? 'none' : 'translateX(-50%)',
}))

export const SidebarSlidePanel: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 50%',
    width: '50%',
    maxWidth: '50%',
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
  })

export const NavContent: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 0 0',
  minHeight: 0,
  overflowY: 'auto',
  padding: theme.spacing(3, 2.5),
  '& > *': {
    flexShrink: 0,
  },
}))

export const SidebarDivider: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 16,
    width: '100%',
  })
