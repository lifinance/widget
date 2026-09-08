import { ChainType } from '@lifi/sdk'

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
