import {
  Box,
  List,
  inputAdornmentClasses,
  inputBaseClasses,
  styled,
  svgIconClasses,
} from '@mui/material'
import { Input as InputBase } from '../../components/Input.js'

interface InputProps {
  size?: 'small' | 'medium'
}

export const Input = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'size',
})<InputProps>(({ theme, size = 'medium' }) => ({
  paddingRight: size === 'small' ? theme.spacing(1.25) : theme.spacing(1.75),
  paddingLeft: theme.spacing(1.25),
  fontSize: size === 'small' ? '0.875rem' : '1rem',
  borderRadius: theme.vars.shape.borderRadius,
  [`& .${inputBaseClasses.input}`]: {
    padding: theme.spacing(1),
  },
  [`& .${inputAdornmentClasses.root}`]: {
    marginLeft: 0,
    marginRight: 0,
    [`& .${svgIconClasses.root}`]: {
      width: size === 'small' ? '1.25rem' : '1.5rem',
    },
  },
  [`& .${inputAdornmentClasses.root}.${inputAdornmentClasses.positionEnd}`]: {
    [`& .${svgIconClasses.root}`]: {
      width: size === 'small' ? '1rem' : '1.25rem',
      height: size === 'small' ? '1rem' : '1.25rem',
    },
  },
}))

interface SearchStickyContainerProps {
  headerHeight: number
}

export const searchContainerHeight = 64

// When the widget is in Full Height layout mode in order to appear "sticky the StickySearchInputContainer needs to use
// position fixed in the same way as the header (see Header.tsx). The headerHeight value here is used as the top value
// to ensure that this container positioned correctly beneath the header
export const StickySearchInputContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'headerHeight',
})<SearchStickyContainerProps>(({ theme, headerHeight }) => ({
  position: 'sticky',
  top: headerHeight,
  zIndex: 1,
  height: searchContainerHeight,
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  backgroundColor: theme.vars.palette.background.default,
  ...(theme.header?.position === 'fixed'
    ? {
        position: 'fixed',
        minWidth: theme.breakpoints.values.xs,
        maxWidth: theme.breakpoints.values.sm,
        width: '100%',
      }
    : {}),
}))

// When in Full Height layout mode, as the StickySearchInputContainer (see above) uses fixed position, the list element needs to provide
// additional paddingTop in order to be positioned correctly.
export const SearchList = styled(List)(({ theme }) => ({
  paddingTop:
    theme.header?.position === 'fixed' ? `${searchContainerHeight}px` : 0,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}))
