import { Box, Button, Card as MuiCard, styled } from '@mui/material'
import type React from 'react'
import { InputCard } from '../../components/Card/InputCard.js'

export const SkeletonHeaderAppBar: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: theme.vars?.palette?.text.primary,
    paddingRight: theme.navigation?.edge ? 0 : theme.spacing?.(1),
  }))

export const SkeletonWalletMenuButtonContainer: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 0, 1, 1.5),
  gap: theme.spacing(1),
}))

export const SkeletonCardRow: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    marginTop: theme.spacing(1.5),
  }))

export const SkeletonAmountContainer: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: 40,
  overflowY: 'hidden',
})

export const SkeletonCard: React.FC<React.ComponentProps<typeof MuiCard>> =
  styled(MuiCard)(({ theme }) => ({
    padding: theme.spacing(1.5, 2, 2),
  }))

export const SkeletonInputCard: React.FC<
  React.ComponentProps<typeof InputCard>
> = styled(InputCard)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 2),
}))

export const SkeletonReviewButtonContainer: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  alignItems: 'center',
}))

export const SkeletonReviewButton: React.FC<
  React.ComponentProps<typeof Button>
> = styled(Button)({
  height: 48,
  pointerEvents: 'none',
})
export const SkeletonSendToWalletButton: React.FC<
  React.ComponentProps<typeof Button>
> = styled(Button)({
  height: 48,
  minWidth: 48,
  width: 48,
  pointerEvents: 'none',
})

export const SkeletonPoweredByContainer: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}))

export const SkeletonHeaderContainer: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)(({ theme }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.vars.palette.background.default,
    position: 'relative',
    top: 0,
    zIndex: 1200,
    gap: theme.spacing(0.5),
    padding: theme.spacing(1.5, 3, 1.5, 3),
    overflow: 'auto',
  }
})
