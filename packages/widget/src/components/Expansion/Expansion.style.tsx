import { Box, type Theme, styled } from '@mui/material'

export const getGapToExpansion = (theme: Theme) => {
  return theme.spacing(3)
}

export const CollapseContainer = styled(Box)(({ theme }) => ({
  zIndex: 0,
  ...(theme.container.display === 'flex'
    ? { display: 'flex', maxHeight: '100%' }
    : { height: 'auto' }),
}))

export const ExpansionBox = styled(Box)(({ theme }) => ({
  marginLeft: getGapToExpansion(theme),
  zIndex: 0,
}))
