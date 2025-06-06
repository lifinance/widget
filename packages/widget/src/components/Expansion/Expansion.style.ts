import { Box, Grow, styled } from '@mui/material'

export const CollapseContainer = styled(Box)(({ theme }) => ({
  zIndex: 0,
  ...(theme.container.display === 'flex'
    ? { display: 'flex', maxHeight: '100%' }
    : { height: 'auto' }),
}))

export const ExpansionTopLevelGrow = styled(Grow)(({ theme }) => ({
  ...(theme.container?.display === 'flex' ? { height: '100%' } : {}),
}))
