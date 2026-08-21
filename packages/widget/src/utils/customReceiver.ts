import { ChainType } from '@lifi/sdk'

// Stellar routes always settle to the account that signs them.
export const isCustomReceiverUnsupported = (
  fromChainType?: ChainType,
  toChainType?: ChainType
): boolean => fromChainType === ChainType.STL && toChainType === ChainType.STL
