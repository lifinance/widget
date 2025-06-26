import { Avatar, Box, Typography } from '@mui/material'
import type { CombinedWallet } from '../hooks/useCombinedWallets'

interface WalletInfoDisplayProps {
  selectedWallet: CombinedWallet | null
  title?: string
  message: string
}

export const WalletInfoDisplay = ({
  selectedWallet,
  title,
  message,
}: WalletInfoDisplayProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 1,
      }}
    >
      {selectedWallet && (
        <Avatar
          src={selectedWallet.icon}
          alt={selectedWallet.name}
          sx={{ width: 96, height: 96 }}
        >
          {selectedWallet.name[0]}
        </Avatar>
      )}
      {title && (
        <Typography
          sx={{
            pt: 2,
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>
      )}
      <Typography
        variant="body2"
        sx={{
          pt: 2,
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {message}
      </Typography>
    </Box>
  )
}
