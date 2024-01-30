import type { WidgetConfig } from '../../types';
import { getChainTypeFromAddress } from '../../utils';

export const attemptToFindMatchingToAddressInConfig = (
  address: string,
  config: WidgetConfig,
) => {
  if (config.toAddress && config.toAddress.address === address) {
    return config.toAddress;
  }

  if (config.toAddresses?.length) {
    const matchingToAddress = config.toAddresses.find(
      (toAddress) => toAddress.address === address,
    );

    if (matchingToAddress) {
      return matchingToAddress;
    }
  }

  return {
    address: address,
    chainType: getChainTypeFromAddress(address),
  };
};
