import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import TabPanel from '@mui/lab/TabPanel'
import type {
  ButtonBaseProps,
  DrawerProps as MuiDrawerProps,
} from '@mui/material'
import { Box, ButtonBase, Drawer as MuiDrawer, styled } from '@mui/material'
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
})<DrawerProps>(({ drawerWidth }) => ({
  width: drawerWidth,
  variants: [
    {
      props: ({ open }) => open,
      style: { zIndex: drawerZIndex },
    },
  ],
}))

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

export const DrawerHandleButton: React.FC<ButtonBaseProps> = styled(
  (props: ButtonBaseProps) => (
    <ButtonBase {...props} disableRipple>
      &nbsp;
    </ButtonBase>
  )
)({
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
})

export const DrawerIconRight: React.FC<
  React.ComponentProps<typeof KeyboardArrowRightIcon>
> = styled(KeyboardArrowRightIcon)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  zIndex: drawerZIndex + 1,
  color: theme.vars.palette.grey[400],
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.grey[600],
  }),
}))

export const DrawerIconLeft: React.FC<
  React.ComponentProps<typeof KeyboardArrowLeftIcon>
> = styled(KeyboardArrowLeftIcon)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  transform: 'translate(-75%, -50%)',
  pointerEvents: 'none',
  zIndex: drawerZIndex + 1,
  color: theme.vars.palette.grey[400],
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.grey[600],
  }),
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
)({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 0 0',
  minHeight: 0,
  overflowY: 'auto',
  padding: '24px 20px',
  '& > *': {
    flexShrink: 0,
  },
})

export const SidebarDivider: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 16,
    width: '100%',
  })
