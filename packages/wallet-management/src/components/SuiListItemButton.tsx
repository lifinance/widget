import { ChainId, ChainType } from '@lifi/sdk'
import { useSuiContext } from '@lifi/widget-provider'
import { createEcosystemListItemButton } from './createEcosystemListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'

export const SuiListItemButton: React.FC<WalletListItemButtonProps> =
  createEcosystemListItemButton({
    useEcosystemContext: useSuiContext,
    chainId: ChainId.SUI,
    chainType: ChainType.MVM,
    label: 'Sui',
  })
