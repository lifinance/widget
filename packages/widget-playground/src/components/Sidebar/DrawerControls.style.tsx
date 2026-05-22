import type { DrawerProps as MuiDrawerProps } from '@mui/material'
import { Box, Drawer as MuiDrawer, styled } from '@mui/material'
import type React from 'react'
import { drawerZIndex } from '../../utils/sidebar.js'

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
      borderRadius: 32,
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

export const NavContent: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 0 0',
  minHeight: 0,
  overflowY: 'auto',
  padding: theme.spacing(3, 2.5),
}))

export const SidebarDivider: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    height: 16,
    width: '100%',
  })
