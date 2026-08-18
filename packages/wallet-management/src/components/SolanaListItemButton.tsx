import { ChainId, ChainType } from '@lifi/sdk'
import { useSolanaContext } from '@lifi/widget-provider'
import { createEcosystemListItemButton } from './createEcosystemListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'

export const SolanaListItemButton: React.FC<WalletListItemButtonProps> =
  createEcosystemListItemButton({
    useEcosystemContext: useSolanaContext,
    chainId: ChainId.SOL,
    chainType: ChainType.SVM,
    label: 'Solana',
  })
