import { ChainType } from '@lifi/sdk';
import { isAddress as isEVMAddress } from 'viem';
import { isSVMAddress } from './svm';

const chainTypeDictionary = {
  [ChainType.EVM]: isEVMAddress,
  [ChainType.SVM]: isSVMAddress,
};

export const getChainTypeFromAddress = (
  address: string,
): ChainType | undefined => {
  for (const chainType in chainTypeDictionary) {
    const isChainType = chainTypeDictionary[chainType as ChainType](address);
    if (isChainType) {
      return chainType as ChainType;
    }
  }
};
