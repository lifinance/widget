import type { ExtendedChain } from '@lifi/sdk'
import { Tooltip } from '@mui/material'
import type React from 'react'
import { type JSX, memo } from 'react'
import type { ChainLabel } from '../../types/widget.js'
import { isShortChainLabel } from '../../utils/pinnedChains.js'
import {
  ChainAvatar,
  ChainCard,
  ChainCardBadge,
  ChainCardBadgeContainer,
  ChainCardBadgeText,
} from './ChainSelect.style.js'

export interface ChainSelectItemProps {
  chain: ExtendedChain
  isSelected: boolean
  isAllNetworks: boolean
  onSelect: (id: number) => void
  label?: ChainLabel
}

export const ChainSelectItem: React.NamedExoticComponent<ChainSelectItemProps> =
  memo(
    ({
      chain,
      isSelected,
      isAllNetworks,
      onSelect,
      label,
    }: ChainSelectItemProps): JSX.Element => {
      const badgeLabel = label && isShortChainLabel(label) ? label : undefined
      return (
        <Tooltip title={chain.name} enterNextDelay={100}>
          <ChainCard
            component="button"
            onClick={() => onSelect(chain.id)}
            type={!isAllNetworks && isSelected ? 'selected' : 'default'}
            selectionColor="secondary"
            // Only a tile with a badge lets content overlap its edge.
            sx={badgeLabel ? { overflow: 'visible' } : undefined}
          >
            <ChainAvatar src={chain.logoURI} alt={chain.key}>
              {chain.name[0]}
            </ChainAvatar>
            {badgeLabel ? (
              <ChainCardBadgeContainer>
                <ChainCardBadge
                  className="chain-badge"
                  sx={
                    Array.isArray(badgeLabel.sx)
                      ? badgeLabel.sx
                      : [badgeLabel.sx]
                  }
                >
                  <ChainCardBadgeText>
                    {badgeLabel.text.trim()}
                  </ChainCardBadgeText>
                </ChainCardBadge>
              </ChainCardBadgeContainer>
            ) : null}
          </ChainCard>
        </Tooltip>
      )
    }
  )
