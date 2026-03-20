import { Box, Container, ScopedCssBaseline, styled } from '@mui/material'
import type { PropsWithChildren } from 'react'

export const CheckoutExpandedContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'stretch',
  flex: 1,
  minHeight: 0,
  height: '100%',
})

export const CheckoutRelativeContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '100%',
  background:
    theme.vars?.palette?.background?.default ??
    theme.palette.background.default,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  maxHeight: '100%',
  borderRadius: 'inherit',
}))

const CssBaselineContainer = styled(ScopedCssBaseline)({
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

export const CheckoutContainer: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <CheckoutRelativeContainer>
      <CssBaselineContainer enableColorScheme>
        <FlexContainer disableGutters>{children}</FlexContainer>
      </CssBaselineContainer>
    </CheckoutRelativeContainer>
  )
}
