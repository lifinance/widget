import { Chip as MuiChip, styled } from '@mui/material'

export enum WalletTagType {
  Multichain = 'multichain',
  Installed = 'installed',
  QrCode = 'qr-code',
  GetStarted = 'get-started',
}

interface WalletTagProps {
  type: WalletTagType
}

export const getLabelByType = (type: WalletTagType) => {
  switch (type) {
    case WalletTagType.Multichain:
      return 'Multichain'
    case WalletTagType.Installed:
      return 'Installed'
    case WalletTagType.QrCode:
      return 'QR Code'
    case WalletTagType.GetStarted:
      return 'Get Started'
    default:
      return ''
  }
}

export const getTagType = (connectorId: string) => {
  if (connectorId === 'walletConnect') {
    return WalletTagType.QrCode
  }

  if (connectorId === 'metaMaskSDK' || connectorId === 'coinbaseWalletSDK') {
    return WalletTagType.GetStarted
  }

  return WalletTagType.Installed
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
          type: WalletTagType.Multichain,
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
      {
        props: {
          type: WalletTagType.Installed,
        },
        style: {
          color: theme.vars.palette.secondary.main,
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.secondary.main} 7.25%, white)`,
          ...theme.applyStyles('dark', {
            color: theme.palette.getContrastText(theme.palette.secondary.main),
            backgroundColor: theme.vars.palette.secondary.main,
          }),
        },
      },
      ...[WalletTagType.GetStarted, WalletTagType.QrCode].map((type) => ({
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
