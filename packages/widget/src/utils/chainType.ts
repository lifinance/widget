import { ChainId, ChainType } from '@lifi/sdk';
import { isAddress as isEVMAddress } from 'viem';
import { isSVMAddress } from './svm.js';

const chainTypeAddressValidation = {
  [ChainType.EVM]: isEVMAddress,
  [ChainType.SVM]: isSVMAddress,
  [ChainType.UTXO]: () => false,
};

export const getChainTypeFromAddress = (
  address: string,
): ChainType | undefined => {
  for (const chainType in chainTypeAddressValidation) {
    const isChainType =
      chainTypeAddressValidation[chainType as ChainType](address);
    if (isChainType) {
      return chainType as ChainType;
    }
  }
};

export const defaultChainIdsByType = {
  [ChainType.EVM]: ChainId.ETH,
  [ChainType.SVM]: ChainId.SOL,
  [ChainType.UTXO]: ChainId.BTC,
};
