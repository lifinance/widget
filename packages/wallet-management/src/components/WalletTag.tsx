import type { StyledComponent } from '@emotion/styled'
import type { ChipProps } from '@mui/material'
import { Chip as MuiChip, styled } from '@mui/material'
import { WalletTagType } from '../types/walletTagType.js'

interface WalletTagProps {
  type: WalletTagType
}

export const WalletTag: StyledComponent<ChipProps & WalletTagProps> = styled(
  MuiChip
)<WalletTagProps>(({ theme }) => {
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
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 8%, transparent)`,
          ...theme.applyStyles('dark', {
            color: theme.vars.palette.text.primary,
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 42%, transparent)`,
          }),
        },
      },
    ],
  }
})
