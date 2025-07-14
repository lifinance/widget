import { Chip as MuiChip, styled } from '@mui/material'
import { WalletTagType } from '../types/walletTagType'

interface WalletTagProps {
  type: WalletTagType
}

export const WalletTag = styled(MuiChip)<WalletTagProps>(({ theme }) => {
  return {
    height: 24,
    px: theme.spacing(1),
    fontSize: 12,
    fontWeight: 600,
    color: theme.vars.palette.text.primary,
    backgroundColor: theme.vars.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.vars.palette.grey[800],
    }),
    variants: [
      {
        props: {
          type: WalletTagType.Connected,
        },
        style: {
          color: theme.vars.palette.primary.main,
          backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.08)`,
          ...theme.applyStyles('dark', {
            color: theme.vars.palette.text.primary,
            backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.42)`,
          }),
        },
      },
    ],
  }
})
