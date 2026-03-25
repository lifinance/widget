import { Box, styled, Typography, typographyClasses } from '@mui/material'
import { ButtonTertiary } from '../ButtonTertiary.js'

const animationDuration = 225

export const SendToWalletExpandButtonIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
})

export const SendToWalletExpandButtonLabelWrapper = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '0fr',
  transition: `grid-template-columns ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
})

export const SendToWalletExpandButtonLabel = styled(Typography)(() => ({
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1.3334,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  opacity: 0,
  transform: 'translateX(-4px)',
  transition: `opacity ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
}))

export const labelWrapperClassName = 'send-to-wallet-label-wrapper'

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
    [`&:hover .${labelWrapperClassName}`]: {
      gridTemplateColumns: '1fr',
    },
    [`&:hover .${labelWrapperClassName} .${typographyClasses.root}`]: {
      opacity: 1,
      transform: 'translateX(0)',
      marginLeft: theme.spacing(0.75),
    },
  })
)
