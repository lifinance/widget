import { Box, Grow, styled } from '@mui/material'
import { defaultMaxHeight } from '../../config/constants'

export const CollapseContainer = styled(Box)(({ theme }) => ({
  zIndex: 0,
  ...(theme.container.display === 'flex'
    ? { display: 'flex', maxHeight: '100%' }
    : { height: 'auto' }),
}))

export const ExpansionTopLevelGrow = styled(Grow)(({ theme }) => ({
  ...(theme.container?.display === 'flex' ? { height: '100%' } : {}),
}))

export const SelectChainExpansionContainer = styled(Box)(({ theme }) => {
  const fullContainerHeight =
    theme.container?.maxHeight || theme.container?.height || defaultMaxHeight
  return {
    position: 'relative',
    boxSizing: 'content-box',
    width: '240px',
    background: theme.vars.palette.background.default,
    overflow: 'hidden',
    flex: 1,
    zIndex: 0,
    ...theme.container,
    height: fullContainerHeight,
    maxHeight: '100%',
    borderRadius: `0 ${theme.container.borderRadius} ${theme.container.borderRadius} 0`,
  }
})
