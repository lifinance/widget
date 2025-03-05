import { convertExtendedChain, isExtendedChain } from '@lifi/wallet-management'
import type { ExtendedChain } from '@lifi/widget'
import { defineChain as thirdwebChain } from 'thirdweb'

export function convertChainsToThirdWebChains(
  chains: ExtendedChain[] | undefined
) {
  if (!chains) {
    return []
  }
  return chains.map((chain) =>
    thirdwebChain(isExtendedChain(chain) ? convertExtendedChain(chain) : chain)
  )
}
