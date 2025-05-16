import { Box, List, styled } from '@mui/material'
import { Input as InputBase } from '../../components/Input.js'

export const Input = styled(InputBase)(({ theme }) => ({
  paddingRight: theme.spacing(1.5),
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
