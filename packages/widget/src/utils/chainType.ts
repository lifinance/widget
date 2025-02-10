import { isUTXOAddress } from '@bigmi/core'
import { ChainId, ChainType, isSVMAddress } from '@lifi/sdk'
import { isValidSuiAddress } from '@mysten/sui/utils'
import { isAddress as isEVMAddress } from 'viem'

const chainTypeAddressValidation = {
  [ChainType.EVM]: isEVMAddress,
  [ChainType.SVM]: isSVMAddress,
  [ChainType.UTXO]: isUTXOAddress,
  ['MVM' as ChainType]: isValidSuiAddress,
}

export const getChainTypeFromAddress = (
  address: string
): ChainType | undefined => {
  for (const chainType in chainTypeAddressValidation) {
    const isChainType =
      chainTypeAddressValidation[chainType as ChainType](address)
    if (isChainType) {
      return chainType as ChainType
    }
  }
}

export const defaultChainIdsByType = {
  [ChainType.EVM]: ChainId.ETH,
  [ChainType.SVM]: ChainId.SOL,
  [ChainType.UTXO]: ChainId.BTC,
  ['MVM' as ChainType]: 9270000000000000 as ChainId,
}
