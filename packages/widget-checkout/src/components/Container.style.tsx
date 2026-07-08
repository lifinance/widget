import { Box, Container, ScopedCssBaseline, styled } from '@mui/material'

export const ExpandedContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: 1,
    minHeight: 0,
    height: '100%',
  })

export const RelativeContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
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

export const CssBaselineContainer: React.FC<
  React.ComponentProps<typeof ScopedCssBaseline>
> = styled(ScopedCssBaseline)({
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

export const FlexContainer: React.FC<React.ComponentProps<typeof Container>> =
  styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  })
