import { Box, type Theme, styled } from '@mui/material'

export const chainExpansionWidth = '240px'

export const getGapToExpansion = (theme: Theme) => {
  return theme.spacing(3)
}

export const CollapseContainer = styled(Box)(({ theme }) => ({
  zIndex: 0,
  ...(theme.container.display === 'flex'
    ? { display: 'flex', maxHeight: '100%' }
    : { height: 'auto' }),
}))
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

export const ExpansionBox = styled(Box)(({ theme }) => ({
  marginLeft: getGapToExpansion(theme),
  zIndex: 0,
}))
