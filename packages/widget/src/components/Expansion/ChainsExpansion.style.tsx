import { Box, styled } from '@mui/material'

export const chainExpansionWidth = '240px'

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
  ...theme.container,
  zIndex: 0,
  height: expansionHeight,
}))
