import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, styled } from '@mui/material'

export const WalletRowsShell = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  '& .MuiCard-root': {
    borderRadius: 16,
    boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
    backgroundColor: theme.vars.palette.background.paper,
    cursor: 'pointer',
  },
  '& .MuiAvatar-root': {
    borderRadius: '16px',
    width: 40,
    height: 40,
  },
  '& .MuiChip-root': {
    height: 24,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    color: theme.vars.palette.text.primary,
    ...theme.applyStyles('dark', {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    }),
  },
}))

export const WalletListStack = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}))

export const MoreWalletsButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  paddingTop: theme.spacing(0.75),
  paddingBottom: theme.spacing(0.75),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  minHeight: 40,
  fontWeight: 700,
  fontSize: 14,
  lineHeight: '18px',
  textTransform: 'none',
  backgroundColor: 'rgba(0, 0, 0, 0.04)',
  color: theme.vars.palette.text.primary,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
  }),
}))

export const MoreWalletsIcon = styled(ExpandMoreIcon)({
  fontSize: 22,
})
