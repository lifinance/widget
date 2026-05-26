import type { SxProps, Theme } from '@mui/material'

export type DrawerOffset = string | 0

export type DrawerShiftProperty = 'left' | 'margin-left' | 'padding-left'

export function drawerShiftTransition(
  theme: Theme,
  property: DrawerShiftProperty
): string {
  return theme.transitions.create(property, {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.sharp,
  })
}

const paddingLeftTransition = (theme: Theme) =>
  drawerShiftTransition(theme, 'padding-left')

const marginLeftTransition = (theme: Theme) =>
  drawerShiftTransition(theme, 'margin-left')

export function getDrawerOffset(
  isDrawerOpen: boolean,
  drawerWidth: number
): DrawerOffset {
  return isDrawerOpen ? `${drawerWidth}px` : 0
}

const mockElementBase = {
  zIndex: 1,
  left: 0,
} as const

function getMockElementDrawerOffset(
  drawerOffset: DrawerOffset
): SxProps<Theme> {
  return {
    ...mockElementBase,
    paddingLeft: drawerOffset,
    transition: paddingLeftTransition,
  }
}

export function getMockHeaderSx(drawerOffset: DrawerOffset): SxProps<Theme> {
  return {
    ...getMockElementDrawerOffset(drawerOffset),
    position: 'fixed',
    top: 0,
  }
}

export function getMockFooterSx(
  drawerOffset: DrawerOffset,
  isFooterFixed: boolean
): SxProps<Theme> {
  return {
    ...getMockElementDrawerOffset(drawerOffset),
    bottom: 0,
    ...(isFooterFixed
      ? { position: 'fixed' }
      : { position: 'absolute', width: '100%' }),
  }
}

export function getWidgetContainerDrawerSx(
  drawerOffset: DrawerOffset
): SxProps<Theme> {
  return {
    marginLeft: drawerOffset,
    transition: marginLeftTransition,
  }
}
