import {
  ChainId,
  ChainType,
  type EVMChain,
  type ExtendedChain,
} from '@lifi/sdk'
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
    defaultChainId: ChainId.ETH,
  },
  {
    name: 'Solana',
    chainType: ChainType.SVM,
    icon: 'https://lifinance.github.io/types/src/assets/icons/chains/solana.svg',
    defaultChainId: ChainId.SOL,
  },
  {
    name: 'Bitcoin',
    chainType: ChainType.UTXO,
    icon: 'https://lifinance.github.io/types/src/assets/icons/chains/bitcoin.svg',
    defaultChainId: ChainId.BTC,
  },
  {
    name: 'Sui',
    chainType: ChainType.MVM,
    icon: 'https://lifinance.github.io/types/src/assets/icons/chains/sui.svg',
    defaultChainId: ChainId.SUI,
  },
]

const maxChainAvatarsCount = chainTypeIcons.length

export const AllChainsAvatar = memo(
  ({ chains, size }: AllChainsAvatarProps) => {
    const icons = useMemo(() => {
      // Create maps for efficient lookups
      const chainsPerChainType = new Map<ChainType, number>()
      const chainsByChainType = new Map<
        ChainType,
        (ExtendedChain | EVMChain)[]
      >()

      chains.forEach((chain) => {
        chainsPerChainType.set(
          chain.chainType,
          (chainsPerChainType.get(chain.chainType) || 0) + 1
        )
        const chainsOfType = chainsByChainType.get(chain.chainType) || []
        chainsOfType.push(chain)
        chainsByChainType.set(chain.chainType, chainsOfType)
      })

      // Get existing ecosystem icons
      const existingChainTypeIcons = chainTypeIcons.filter(
        (predefinedChain) => {
          const numberOfChains =
            chainsPerChainType.get(predefinedChain.chainType) ?? 0

          // If there's only one chain of this type, check if it's not the default
          if (numberOfChains === 1) {
            const chainsOfType = chainsByChainType.get(
              predefinedChain.chainType
            )
            const singleChain = chainsOfType?.[0]
            // Exclude the predefined icon if the single chain is not the default
            if (
              singleChain &&
              singleChain.id !== predefinedChain.defaultChainId
            ) {
              return false
            }
          }

          return numberOfChains > 0
        }
      )

      if (existingChainTypeIcons.length === maxChainAvatarsCount) {
        return existingChainTypeIcons
      }

      const remainingSlots =
        maxChainAvatarsCount - existingChainTypeIcons.length

      // Create a Set for O(1) lookup of predefined icon names
      const predefinedIconNames = new Set(
        existingChainTypeIcons.map((icon) => icon.name)
      )

      const chainsWithLogos = chains.filter((chain) => {
        // Filter out chain icons matching ecosystem icons
        return !predefinedIconNames.has(chain.name) && Boolean(chain.logoURI)
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
