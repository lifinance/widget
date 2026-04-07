import { Box, styled } from '@mui/material'
import type React from 'react'

export const chainExpansionWidth = '256px'

interface SelectChainExpansionContainerProps {
  expansionHeight: string | number
}

export const SelectChainExpansionContainer: React.FC<
  React.ComponentProps<typeof Box> & SelectChainExpansionContainerProps
> = styled(Box, {
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
