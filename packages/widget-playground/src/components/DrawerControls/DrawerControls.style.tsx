import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import TabPanel from '@mui/lab/TabPanel'
import type {
  ButtonBaseProps,
  DrawerProps as MuiDrawerProps,
} from '@mui/material'
import { Box, ButtonBase, Drawer as MuiDrawer, styled } from '@mui/material'
export const drawerZIndex = 1501
export const autocompletePopperZIndex = drawerZIndex + 1
export const tooltipPopperZIndex = drawerZIndex + 2
export const popperZIndex = drawerZIndex + 3
export const headerZIndex = tooltipPopperZIndex

interface DrawerProps extends MuiDrawerProps {
  drawerWidth: number
}
export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => !['drawerWidth'].includes(prop as string),
})<DrawerProps>(({ drawerWidth }) => ({
  width: drawerWidth,
  // NOTE: setting the zIndex seems to prevent clicks underneath where the
  //  draw was when closed - so we only want to see the zIndex when its open
  variants: [
    {
      props: ({ open }) => open,
      style: { zIndex: drawerZIndex },
    },
  ],
}))

export const Header = styled('h1')({
  fontSize: '1.5em',
  margin: 0,
  lineHeight: 0.8,
})

export const HeaderRow = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: headerZIndex,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  margin: theme.spacing(-1),
}))

export const WidgetConfigControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}))

export const DrawerContentContainer = styled(Box, {
  shouldForwardProp: (prop) => !['drawerWidth'].includes(prop as string),
})<{
  drawerWidth: number
}>(({ theme, drawerWidth }) => ({
  display: 'flex',
  width: drawerWidth,
  padding: theme.spacing(3),
  flexDirection: 'column',
  flexGrow: 1,
  gap: theme.spacing(2),
  zIndex: 1200,
}))

export const TabContentContainer = styled(TabPanel)(({ theme }) => ({
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
})

export const DrawerIconRight = styled(KeyboardArrowRightIcon)(({ theme }) => ({
  color: theme.palette.grey[600],
  position: 'fixed',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  zIndex: drawerZIndex + 1,
  ...theme.applyStyles('light', {
    color: theme.palette.grey[400],
  }),
}))

export const DrawerIconLeft = styled(KeyboardArrowLeftIcon)(({ theme }) => ({
  color: theme.palette.grey[600],
  position: 'fixed',
  top: '50%',
  transform: 'translate(-75%, -50%)',
  pointerEvents: 'none',
  zIndex: drawerZIndex + 1,
  ...theme.applyStyles('light', {
    color: theme.palette.grey[400],
  }),
}))
