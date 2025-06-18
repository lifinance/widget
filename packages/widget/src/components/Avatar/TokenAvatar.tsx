import type { Chain, StaticToken } from '@lifi/sdk'
import type { SxProps, Theme } from '@mui/material'
import { Badge } from '@mui/material'
import { useChain } from '../../hooks/useChain.js'
import { useToken } from '../../hooks/useToken.js'
import { AvatarBadgedSkeleton } from './Avatar.js'
import { AvatarDefaultBadge, AvatarMasked } from './Avatar.style.js'
import { SmallAvatar } from './SmallAvatar.js'

export const TokenAvatar: React.FC<{
  token?: StaticToken
  chain?: Chain
  isLoading?: boolean
  sx?: SxProps<Theme>
  tokenAvatarSize?: number
  chainAvatarSize?: number
}> = ({
  token,
  chain,
  isLoading,
  sx,
  tokenAvatarSize = 40,
  chainAvatarSize = 16,
}) => {
  if (!chain || !token?.logoURI) {
    return (
      <TokenAvatarFallback
        token={token}
        isLoading={isLoading}
        sx={sx}
        tokenAvatarSize={tokenAvatarSize}
        chainAvatarSize={chainAvatarSize}
      />
    )
  }
  return (
    <TokenAvatarBase
      token={token}
      chain={chain}
      isLoading={isLoading}
      sx={sx}
      avatarSize={tokenAvatarSize}
      badgeSize={chainAvatarSize}
    />
  )
}

export const TokenAvatarFallback: React.FC<{
  token?: StaticToken
  isLoading?: boolean
  sx?: SxProps<Theme>
  tokenAvatarSize: number
  chainAvatarSize: number
}> = ({ token, isLoading, sx, tokenAvatarSize, chainAvatarSize }) => {
  const { chain } = useChain(token?.chainId)
  const { token: chainToken, isLoading: isLoadingToken } = useToken(
    token?.chainId,
    token?.address
  )
  return (
    <TokenAvatarBase
      token={chainToken ?? token}
      isLoading={isLoading || isLoadingToken}
      chain={chain}
      sx={sx}
      avatarSize={tokenAvatarSize}
      badgeSize={chainAvatarSize}
    />
  )
}

export const TokenAvatarBase: React.FC<{
  token?: StaticToken
  chain?: Chain
  isLoading?: boolean
  sx?: SxProps<Theme>
  avatarSize: number
  badgeSize: number
}> = ({ token, chain, isLoading, sx, avatarSize, badgeSize }) => {
  return isLoading ? (
    <AvatarBadgedSkeleton avatarSize={avatarSize} badgeSize={badgeSize} />
  ) : (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        chain ? (
          <SmallAvatar src={chain.logoURI} alt={chain.name} size={badgeSize}>
            {chain.name[0]}
          </SmallAvatar>
        ) : (
          <AvatarDefaultBadge size={badgeSize} />
        )
      }
      sx={sx}
    >
      <AvatarMasked
        src={token?.logoURI}
        alt={token?.symbol}
        avatarSize={avatarSize}
        badgeSize={badgeSize}
      >
        {token?.symbol?.[0]}
      </AvatarMasked>
    </Badge>
  )
}
