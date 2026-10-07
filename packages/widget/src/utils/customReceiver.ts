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

// Without a receiver the API delivers to the signer when both chains share a
// chain type, and a Bitcoin signer cannot receive on ZEC.
export const isSignerInvalidReceiver = ({
  signerAddress,
  toAddress,
  fromChain,
  toChain,
  isAddressForChain,
}: {
  signerAddress: string | undefined
  toAddress: string | undefined
  fromChain: ChainRef | undefined
  toChain: ChainRef | undefined
  isAddressForChain: IsAddressForChain
}): boolean =>
  Boolean(
    signerAddress &&
      !toAddress &&
      fromChain &&
      toChain &&
      fromChain.chainType === toChain.chainType &&
      !isAddressForChain(signerAddress, toChain)
  )

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
