import { Box, styled, Typography } from '@mui/material'
import { ButtonTertiary } from '../ButtonTertiary.js'

const animationDuration = 225

export const SendToWalletExpandButtonIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
})

export const SendToWalletExpandButtonLabel = styled(Typography)({
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1.334,
})

export const SendToWalletExpandButtonChip = styled(ButtonTertiary)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0.75),
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.3334,
    borderRadius: theme.shape.borderRadiusSecondary,
    height: 24,
    minWidth: 'auto',
    '& .MuiTypography-root': {
      maxWidth: 0,
      paddingLeft: 0,
      paddingRight: 0,
      opacity: 0,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      transform: 'translateX(-4px)',
      transition: `max-width ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), padding ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${animationDuration / 2}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    },
    '&:hover .MuiTypography-root': {
      maxWidth: 120,
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      opacity: 1,
      transform: 'translateX(0)',
    },
  })
)
