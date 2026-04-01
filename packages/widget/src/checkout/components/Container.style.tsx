import { Box, Container, ScopedCssBaseline, styled } from '@mui/material'

export const ExpandedContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'stretch',
  flex: 1,
  minHeight: 0,
  height: '100%',
})

export const RelativeContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '100%',
  background: theme.vars.palette.background.default,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  maxHeight: '100%',
  borderRadius: 'inherit',
}))

export const CssBaselineContainer = styled(ScopedCssBaseline)({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  overflowX: 'clip',
  margin: 0,
  width: '100%',
  minHeight: 0,
  maxHeight: '100%',
  overflowY: 'auto',
  height: '100%',
})

export const FlexContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
})
