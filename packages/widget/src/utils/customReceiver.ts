import { ChainType } from '@lifi/sdk'
import type { ChainRef, IsAddressForChain } from '@lifi/widget-provider'

// Stellar routes always settle to the account that signs them.
export const isCustomReceiverUnsupported = (
  fromChainType?: ChainType,
  toChainType?: ChainType
): boolean => fromChainType === ChainType.STL && toChainType === ChainType.STL

export interface CustomReceiverBlockedArgs {
  fromChainType?: ChainType
  toChainType?: ChainType
  toAddress?: string
  signerAddress?: string
  receiverRequired?: boolean
}

export const isCustomReceiverBlocked = ({
  fromChainType,
  toChainType,
  toAddress,
  signerAddress,
  receiverRequired,
}: CustomReceiverBlockedArgs): boolean => {
  if (!isCustomReceiverUnsupported(fromChainType, toChainType)) {
    return false
  }
  if (!toAddress) {
    return Boolean(receiverRequired)
  }
  return toAddress.toLowerCase() !== signerAddress?.toLowerCase()
}

/**
 * Whether the receiver lets a quote be requested: none is set, or the one set
 * is valid on the destination chain. A chain type alone cannot tell a Bitcoin
 * address from a Zcash one.
 */
export const canQuoteWithToAddress = (
  toAddress: string | undefined,
  toChain: ChainRef | undefined,
  isAddressForChain: IsAddressForChain
): boolean => {
  if (!toAddress) {
    return true
  }
  return toChain ? isAddressForChain(toAddress, toChain) : false
}
