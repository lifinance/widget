import { Box, styled } from '@mui/material'
import { Card } from '../Card/Card.js'

export const IconCard = styled(Card)(({ theme }) => ({
  height: 40,
  width: 40,
  fontSize: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.vars.shape.borderRadiusTertiary,
  zIndex: 1110,
}))

export const ReverseContainer = styled(Box)(({ theme }) => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(-2.5),
  }
})

export const ReverseTokensButtonEmpty = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
