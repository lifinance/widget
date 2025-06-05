import { Box, styled } from '@mui/material'

export const SelectChainExpansionContainer = styled(Box)(({ theme }) => {
  return {
    position: 'relative',
    boxSizing: 'content-box',
    width: '240px',
    background: theme.vars.palette.background.default,
    overflow: 'auto',
    flex: 1,
    zIndex: 0,
    ...theme.container,
    maxHeight: '100%',
    borderRadius: `0 ${theme.container.borderRadius} ${theme.container.borderRadius} 0`,
  }
})
