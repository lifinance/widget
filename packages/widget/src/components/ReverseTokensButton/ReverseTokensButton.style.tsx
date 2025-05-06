import { Box, styled } from '@mui/material'
import { Card } from '../Card/Card.js'

export const IconCard = styled(Card)(({ theme }) => ({
  height: 32,
  width: 32,
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
    margin: theme.spacing(-1),
  }
})

export const ReverseTokensButtonEmpty = styled(Box)(({ theme }) => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(1),
  }
})
