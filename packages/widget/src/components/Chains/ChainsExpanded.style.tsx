import { Box, styled } from '@mui/material'

export const chainExpansionWidth = '256px'

interface SelectChainExpansionContainerProps {
  expansionHeight: string | number
}

export const SelectChainExpansionContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'expansionHeight',
})<SelectChainExpansionContainerProps>(({ theme, expansionHeight }) => ({
  position: 'relative',
  boxSizing: 'content-box',
  width: chainExpansionWidth,
  background: theme.vars.palette.background.default,
  overflow: 'hidden',
  flex: 1,
  borderRadius: theme.container?.borderRadius ?? 0,
  boxShadow: theme.container?.boxShadow ?? 'none',
  zIndex: 0,
  height: expansionHeight,
  ...(theme.chainSidebarContainer ?? {}),
}))
