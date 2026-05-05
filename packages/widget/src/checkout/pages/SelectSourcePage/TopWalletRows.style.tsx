import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, styled } from '@mui/material'

export const WalletRowsShell: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    '& .MuiCard-root': {
      cursor: 'pointer',
    },
    '& .MuiAvatar-root': {
      borderRadius: theme.vars.shape.borderRadius,
    },
  }))

export const WalletListStack: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  }))

export const MoreWalletsButton: React.FC<React.ComponentProps<typeof Button>> =
  styled(Button)(({ theme }) => ({
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    minHeight: 40,
    fontWeight: 700,
    fontSize: 14,
    lineHeight: '18px',
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    color: theme.vars.palette.text.primary,
    '&:hover': {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.06)`,
    },
  }))

export const MoreWalletsIcon: React.FC<
  React.ComponentProps<typeof ExpandMoreIcon>
> = styled(ExpandMoreIcon)({
  fontSize: 22,
})
