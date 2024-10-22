import { Box, Button, Card as MuiCard, styled } from '@mui/material'
import { InputCard } from '../../components/Card/InputCard.js'

export const SkeletonHeaderAppBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  color: theme.palette?.text.primary,
  paddingRight: theme.navigation?.edge ? 0 : theme.spacing?.(1),
}))

export const SkeletonWalletMenuButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 0, 1, 1.5),
  gap: theme.spacing(1),
}))

export const SkeletonCardRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  marginTop: theme.spacing(1.5),
}))

export const SkeletonAmountContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: 40,
  overflowY: 'hidden',
})

export const SkeletonCard = styled(MuiCard)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 2),
}))

export const SkeletonInputCard = styled(InputCard)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 2),
}))

export const SkeletonReviewButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  alignItems: 'center',
}))

export const SkeletonReviewButton = styled(Button)({
  height: 48,
  pointerEvents: 'none',
})
export const SkeletonSendToWalletButton = styled(Button)({
  height: 48,
  minWidth: 48,
  width: 48,
  pointerEvents: 'none',
})

export const SkeletonPoweredByContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}))

export const SkeletonHeaderContainer = styled(Box)(({ theme }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    backdropFilter: 'blur(12px)',
    position: 'relative',
    top: 0,
    zIndex: 1200,
    gap: theme.spacing(0.5),
    padding: theme.spacing(1.5, 3, 1.5, 3),
    overflow: 'auto',
  }
})
