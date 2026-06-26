import { Avatar, Box, Card, styled, Typography } from '@mui/material'

export const OptionsRoot: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
}))

export const FundingSectionStack: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    width: '100%',
  }))

export const FundingSectionLabel: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '18px',
  color: theme.vars.palette.text.secondary,
  width: '100%',
}))

// Plain MuiCard, same as the wallet-list CardListItemButton, so border/radius/
// shadow resolve from the theme's outlined variant identically on every theme.
export const FundingOptionCard: typeof Card = Card

export const FundingOptionRow: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),
    width: '100%',
  }))

export const GenericIconWrap: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    color: theme.vars.palette.text.primary,
    '& .MuiSvgIcon-root': {
      fontSize: 22,
    },
  }))

export const OptionTextCell: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)({
    flex: 1,
    minWidth: 0,
  })

export const FundingOptionTitle: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 16,
  lineHeight: '20px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: theme.vars.palette.text.primary,
}))

export const FundingOptionSubtitle: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: 12,
  lineHeight: '16px',
  color: theme.vars.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const FundingDividerRow: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    width: '100%',
  }))

export const FundingDividerLine: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    flex: 1,
    height: 1,
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
  }))

export const FundingOrLabel: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '16px',
    color: theme.vars.palette.text.secondary,
    flexShrink: 0,
  }))

export const OverlapRow: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  flexShrink: 0,
  paddingRight: 8,
  '& .MuiAvatar-root': {
    marginLeft: -8,
  },
  '& .MuiAvatar-root:first-of-type': {
    marginLeft: 0,
  },
})

export const PreviewWalletAvatar: React.FC<
  React.ComponentProps<typeof Avatar>
> = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
  fontSize: 10,
  border: `2px solid ${theme.vars.palette.background.paper}`,
}))

export const OverflowPreviewAvatar: React.FC<
  React.ComponentProps<typeof Avatar>
> = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
  fontSize: 10,
  fontWeight: 700,
  lineHeight: '14px',
  border: `1.5px solid ${theme.vars.palette.background.paper}`,
  backgroundColor: theme.vars.palette.background.default,
  color: theme.vars.palette.text.secondary,
}))

export const PaymentMarksWrap: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    flexShrink: 0,
  }))

export const PaymentBrandImg: React.FC<React.ComponentProps<'img'>> = styled(
  'img'
)({
  width: 40,
  height: 26,
  objectFit: 'contain',
  flexShrink: 0,
})
