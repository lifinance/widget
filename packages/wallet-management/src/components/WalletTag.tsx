import { Chip as MuiChip, styled } from '@mui/material'
import { WalletTagType } from '../types/walletTagType'
interface WalletTagProps {
  type: WalletTagType
}

export const WalletTag = styled(MuiChip)<WalletTagProps>(({ theme }) => {
  return {
    height: 24,
    px: theme.spacing(1),
    fontSize: 10,
    fontWeight: 700,
    variants: [
      {
        props: {
          type: WalletTagType.Connected,
        },
        style: {
          color: theme.vars.palette.primary.main,
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 7.25%, white)`,
          ...theme.applyStyles('dark', {
            color: theme.palette.getContrastText(theme.palette.primary.main),
            backgroundColor: theme.vars.palette.primary.main,
          }),
        },
      },
      ...[
        WalletTagType.Multichain,
        WalletTagType.Installed,
        WalletTagType.GetStarted,
        WalletTagType.QrCode,
      ].map((type) => ({
        props: { type },
        style: {
          color: theme.vars.palette.text.primary,
          backgroundColor: theme.vars.palette.grey[100],
          ...theme.applyStyles('dark', {
            backgroundColor: theme.vars.palette.grey[800],
          }),
        },
      })),
    ],
  }
})
