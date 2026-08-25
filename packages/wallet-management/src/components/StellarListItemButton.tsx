import { ChainId, ChainType } from '@lifi/sdk'
import { useStellarContext } from '@lifi/widget-provider'
import { createEcosystemListItemButton } from './createEcosystemListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'

export const StellarListItemButton: React.FC<WalletListItemButtonProps> =
  createEcosystemListItemButton({
    useEcosystemContext: useStellarContext,
    chainId: ChainId.XLM,
    chainType: ChainType.STL,
    label: 'Stellar',
  })
