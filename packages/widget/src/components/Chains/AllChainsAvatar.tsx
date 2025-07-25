import type { EVMChain, ExtendedChain } from '@lifi/sdk'
import { Avatar, Box } from '@mui/material'

interface AllChainsAvatarProps {
  chains: ExtendedChain[] | EVMChain[]
  size: 'small' | 'medium'
}

const maxChainAvatarsCount = 4

export const AllChainsAvatar = ({ chains, size }: AllChainsAvatarProps) => {
  const wrapperSize = size === 'small' ? '32px' : '40px'
  const avatarSize = size === 'small' ? '12px' : '16px'
  const avatarsCount = Math.min(chains.length, maxChainAvatarsCount)
  return (
    <Box
      sx={{
        width: wrapperSize,
        height: wrapperSize,
        display: 'grid',
        gridTemplateRows: `repeat(${avatarsCount > 2 ? 2 : 1}, 1fr)`,
        gridTemplateColumns: `repeat(${avatarsCount > 1 ? 2 : 1}, 1fr)`,
        placeItems: 'center',
      }}
    >
      {chains.slice(0, avatarsCount).map((chain, idx) => {
        return (
          <Avatar
            key={`${chain.name}-${idx}`}
            src={chain.logoURI}
            alt={chain.name}
            sx={{
              width: avatarSize,
              height: avatarSize,
              margin: 'auto',
              ...(avatarsCount === 3 && idx === 2
                ? {
                    // For 3 items in the 2x2 grid:
                    // center the last item horizontally
                    gridColumn: '1 / span 2',
                    gridRow: '2',
                    justifySelf: 'center',
                  }
                : {}),
            }}
          >
            {chain.name[0]}
          </Avatar>
        )
      })}
    </Box>
  )
}
