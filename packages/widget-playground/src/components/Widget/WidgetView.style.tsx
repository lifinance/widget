import { defaultMaxHeight } from '@lifi/widget'
import type { BoxProps, Theme } from '@mui/material'
import { Box, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { CSSProperties } from 'react'
import { drawerZIndex } from '../DrawerControls/DrawerControls.style.js'

export const FloatingToolsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  position: 'absolute',
  zIndex: drawerZIndex,
  padding: theme.spacing(3, 0, 0, 3),
}))

interface WidgetContainerProps extends BoxProps {
  removePaddingTop?: boolean
  alignTop?: boolean
}

export const WidgetContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !['removePaddingTop', 'alignTop'].includes(prop as string),
})<WidgetContainerProps>(({ theme }) => {
  return {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: theme.spacing(6),
    variants: [
      {
        props: ({ alignTop }) => alignTop,
        style: {
          justifyContent: 'flex-start',
        },
      },
      {
        props: ({ removePaddingTop }) => removePaddingTop,
        style: {
          paddingTop: 0,
        },
      },
    ],
  }
})

interface WidgetContainerRowProps extends BoxProps {
  alignTop?: boolean
  widgetContainer?: CSSProperties
}

export const WidgetContainerRow = styled(Box, {
  shouldForwardProp: (prop) =>
    !['alignTop', 'widgetContainer'].includes(prop as string),
})<WidgetContainerRowProps>(({ widgetContainer }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    width: '100%',
    maxHeight:
      widgetContainer?.maxHeight || !widgetContainer?.height
        ? (widgetContainer?.maxHeight ?? defaultMaxHeight)
        : 'none',
    variants: [
      {
        props: ({ alignTop }) => alignTop,
        style: {
          alignItems: 'flex-start',
        },
      },
    ],
  }
})

const floatingToolButtonColors = (theme: Theme) => ({
  color: theme.vars.palette.text.primary,
  backgroundColor: theme.vars.palette.common.white,
  '&:hover': {
    backgroundColor: `rgba(${theme.vars.palette.common.backgroundChannel}, 0.08)`,
  },
  ...theme.applyStyles('dark', {
    backgroundColor: theme.vars.palette.grey[900],
    '&:hover': {
      backgroundColor: `rgba(${theme.vars.palette.common.backgroundChannel}, 0.04)`,
    },
  }),
})

export const DrawerOpenButton = styled(IconButton)(({ theme }) => ({
  ...floatingToolButtonColors(theme),
  boxShadow:
    '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
}))

export const Main = styled('main', {
  shouldForwardProp: (prop) =>
    !['drawerWidth', 'open'].includes(prop as string),
})<{
  drawerWidth: number
  open?: boolean
}>(({ theme, drawerWidth }) => ({
  display: 'flex',
  justifyContent: 'stretch',
  position: 'relative',
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  '& > [data-rk]': {
    display: 'flex',
    flexGrow: '1',
  },
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}))
