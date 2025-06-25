import { Box, styled } from '@mui/material'
import { defaultMaxHeight } from '../../config/constants'

export const chainExpansionWidth = '240px'

export const CollapseContainer = styled(Box)(({ theme }) => ({
  zIndex: 0,
  ...(theme.container.display === 'flex'
    ? { display: 'flex', maxHeight: '100%' }
    : { height: 'auto' }),
}))

export const SelectChainExpansionContainer = styled(Box)(({ theme }) => {
  const fullContainerHeight =
    theme.container?.maxHeight || theme.container?.height || defaultMaxHeight
  return {
    position: 'relative',
    boxSizing: 'content-box',
    width: chainExpansionWidth,
    background: theme.vars.palette.background.default,
    overflow: 'hidden',
    flex: 1,
    zIndex: 0,
    ...theme.container,
    height: fullContainerHeight,
    maxHeight: '100%',
    borderRadius: `0 ${theme.container.borderRadius} ${theme.container.borderRadius} 0`,
    boxShadow: 'none',
    borderLeft: `1px solid ${theme.vars.palette.grey[300]}`,
    ...theme.applyStyles('dark', {
      borderLeft: `1px solid ${theme.vars.palette.grey[800]}`,
    }),
  }
})
