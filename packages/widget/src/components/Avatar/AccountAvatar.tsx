import { getConnectorIcon } from '@lifi/wallet-management'
import type { Account } from '@lifi/widget-provider'
import Wallet from '@mui/icons-material/Wallet'
import { Badge } from '@mui/material'
import type { JSX } from 'react'
import { useChain } from '../../hooks/useChain.js'
import type { ToAddress } from '../../types/widget.js'
import { AvatarDefault, AvatarMasked } from './Avatar.style.js'
import { ChainBadgeContent } from './ChainBadgeContent.js'

interface AccountAvatarProps {
  chainId?: number
  account?: Account
  toAddress?: ToAddress
  empty?: boolean
  size?: number
  badgeSize?: number
}

export const AccountAvatar = ({
  chainId,
  account,
  empty,
  toAddress,
  size,
  badgeSize,
}: AccountAvatarProps): JSX.Element => {
  const { chain } = useChain(chainId)

  const walletIconSize = size ? Math.floor(size * 0.5) : 20

  const avatar = empty ? (
    <AvatarDefault
      badgeSize={badgeSize}
      sx={size ? { width: size, height: size } : undefined}
    />
  ) : account?.connector || toAddress?.logoURI ? (
    <AvatarMasked
      src={toAddress?.logoURI || getConnectorIcon(account?.connector)}
      alt={toAddress?.name || account?.connector?.name}
      avatarSize={size}
      badgeSize={badgeSize}
    >
      {(toAddress?.name || account?.connector?.name)?.[0]}
    </AvatarMasked>
  ) : (
    <AvatarDefault
      badgeSize={badgeSize}
      sx={size ? { width: size, height: size } : undefined}
    >
      <Wallet sx={{ fontSize: walletIconSize }} />
    </AvatarDefault>
  )

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={<ChainBadgeContent chain={chain} size={badgeSize} />}
    >
      {avatar}
    </Badge>
  )
}
