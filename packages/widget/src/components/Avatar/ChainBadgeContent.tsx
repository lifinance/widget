import type { Chain, ExtendedChain } from '@lifi/sdk'
import { AvatarDefaultBadge } from './Avatar.style.js'
import { SmallAvatar } from './SmallAvatar.js'

interface ChainBadgeContentProps {
  chain?: Chain | ExtendedChain
  size?: number
}

export const ChainBadgeContent: React.FC<ChainBadgeContentProps> = ({
  chain,
  size = 16,
}) => {
  if (chain?.logoURI) {
    return (
      <SmallAvatar src={chain.logoURI} alt={chain.name} size={size}>
        {chain.name?.[0]}
      </SmallAvatar>
    )
  }
  return <AvatarDefaultBadge size={size} />
}
