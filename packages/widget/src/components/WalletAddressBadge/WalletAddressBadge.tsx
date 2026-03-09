import Wallet from '@mui/icons-material/Wallet'
import { Typography } from '@mui/material'
import { shortenAddress } from '../../utils/wallet.js'
import { BadgeRoot } from './WalletAddressBadge.style.js'

interface WalletAddressBadgeProps {
  address: string
}

export const WalletAddressBadge: React.FC<WalletAddressBadgeProps> = ({
  address,
}) => {
  return (
    <BadgeRoot>
      <Wallet sx={{ width: 16, height: 16 }} />
      <Typography
        component="span"
        sx={{
          fontSize: 12,
          fontWeight: 700,
          lineHeight: '16px',
          color: 'text.primary',
          px: 0.5,
        }}
      >
        {shortenAddress(address)}
      </Typography>
    </BadgeRoot>
  )
}
