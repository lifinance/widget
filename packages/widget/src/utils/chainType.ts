import { isUTXOAddress } from '@bigmi/core'
import { ChainId, ChainType, isSVMAddress } from '@lifi/sdk'
import { isAddress as isEVMAddress } from 'viem'

const chainTypeAddressValidation = {
  [ChainType.EVM]: isEVMAddress,
  [ChainType.SVM]: isSVMAddress,
  [ChainType.UTXO]: isUTXOAddress,
  [ChainType.MVM]: () => false,
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
  [ChainType.MVM]: ChainId.SUI,
}
