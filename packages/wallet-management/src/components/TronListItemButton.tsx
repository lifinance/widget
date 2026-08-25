import { ChainId, ChainType } from '@lifi/sdk'
import { useTronContext } from '@lifi/widget-provider'
import { createEcosystemListItemButton } from './createEcosystemListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'

export const TronListItemButton: React.FC<WalletListItemButtonProps> =
  createEcosystemListItemButton({
    useEcosystemContext: useTronContext,
    chainId: ChainId.TRN,
    chainType: ChainType.TVM,
    label: 'Tron',
  })
