import { Box, styled } from '@mui/material'

export const chainExpansionWidth = '256px'

interface SelectChainExpansionContainerProps {
  expansionHeight: string | number
}

export const SelectChainExpansionContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'expansionHeight',
})<SelectChainExpansionContainerProps>(({ theme, expansionHeight }) => ({
  ...theme.container,
  position: 'relative',
  boxSizing: 'content-box',
  width: chainExpansionWidth,
  background: theme.vars.palette.background.default,
  overflow: 'hidden',
  flex: 1,
  zIndex: 0,
  height: expansionHeight,
  ...theme.chainSidebarContainer,
}))
