import { ChainType, type EVMChain, type ExtendedChain } from '@lifi/sdk'
import { Avatar, Box } from '@mui/material'
import { memo, useMemo } from 'react'

interface AllChainsAvatarProps {
  chains: ExtendedChain[] | EVMChain[]
  size: 'small' | 'medium'
}

const chainTypeIcons = [
  {
    name: 'Ethereum',
    chainType: ChainType.EVM,
    icon: 'https://lifinance.github.io/types/src/assets/icons/chains/ethereum.svg',
  },
  {
    name: 'Solana',
    chainType: ChainType.SVM,
    icon: 'https://lifinance.github.io/types/src/assets/icons/chains/solana.svg',
  },
  {
    name: 'Bitcoin',
    chainType: ChainType.UTXO,
    icon: 'https://lifinance.github.io/types/src/assets/icons/chains/bitcoin.svg',
  },
  {
    name: 'Sui',
    chainType: ChainType.MVM,
    icon: 'https://lifinance.github.io/types/src/assets/icons/chains/sui.svg',
  },
]

const maxChainAvatarsCount = chainTypeIcons.length

export const AllChainsAvatar = memo(
  ({ chains, size }: AllChainsAvatarProps) => {
    const icons = useMemo(() => {
      // Get existing ecosystem icons
      const existingChainTypeIcons = chainTypeIcons.filter((predefinedChain) =>
        chains.some((chain) => chain.chainType === predefinedChain.chainType)
      )
      if (existingChainTypeIcons.length === maxChainAvatarsCount) {
        return existingChainTypeIcons
      }

      const remainingSlots =
        maxChainAvatarsCount - existingChainTypeIcons.length

      const chainsWithLogos = chains.filter((chain) => {
        // Filter out chain icons matching ecosystem icons
        const hasPredefinedIcon = existingChainTypeIcons.some(
          (icon) => icon.name === chain.name
        )
        const hasLogoURI = Boolean(chain.logoURI)
        return !hasPredefinedIcon && hasLogoURI
      })

      const additionalIcons = chainsWithLogos
        .slice(0, remainingSlots)
        .map((chain) => ({
          name: chain.name,
          chainType: chain.chainType,
          icon: chain.logoURI!,
        }))

      return [...existingChainTypeIcons, ...additionalIcons]
    }, [chains])

    const wrapperSize = size === 'small' ? '32px' : '40px'
    const avatarSize = size === 'small' ? '12px' : '16px'
    const avatarsCount = Math.min(icons.length, maxChainAvatarsCount)
    const gridRows = avatarsCount > 2 ? 2 : 1
    const gridColumns = avatarsCount > 1 ? 2 : 1

    return (
      <Box
        sx={{
          width: wrapperSize,
          height: wrapperSize,
          display: 'grid',
          gridTemplateRows: `repeat(${gridRows}, 1fr)`,
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          placeItems: 'center',
        }}
      >
        {icons.slice(0, avatarsCount).map((chain, idx) => {
          const isThirdAvatarInThreeAvatarLayout =
            avatarsCount === 3 && idx === 2

          return (
            <Avatar
              key={`${chain.chainType}-${idx}`}
              src={chain.icon}
              alt={chain.name}
              sx={{
                width: avatarSize,
                height: avatarSize,
                margin: 'auto',
                ...(isThirdAvatarInThreeAvatarLayout && {
                  gridColumn: '1 / span 2',
                  gridRow: '2',
                  justifySelf: 'center',
                }),
              }}
            >
              {chain.chainType[0]}
            </Avatar>
          )
        })}
      </Box>
    )
  }
)
