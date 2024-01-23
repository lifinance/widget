import type { ChainType } from '@lifi/sdk';
import { useMutation } from '@tanstack/react-query';
import { getEnsAddress } from '@wagmi/core';
import { useTranslation } from 'react-i18next';
import { normalize } from 'viem/ens';
import { useConfig } from 'wagmi';
import { getChainTypeFromAddress } from '../utils';

type AddressType = 'address' | 'ENS';

type ValidResponse = {
  address: string;
  addressType: AddressType;
  chainType: ChainType;
  isValid: true;
};

type InvalidResponse = {
  error: string;
  isValid: false;
};

export const useAddressValidation = () => {
  const { t } = useTranslation();
  const config = useConfig();

  const { mutateAsync: validateAddress, isPending: isValidating } = useMutation(
    {
      mutationFn: async (
        value: string,
      ): Promise<ValidResponse | InvalidResponse> => {
        try {
          if (!value) {
            throw new Error();
          }

          const chainType = getChainTypeFromAddress(value);
          if (chainType) {
            return {
              address: value,
              addressType: 'address',
              chainType,
              isValid: true,
            };
          }

          const address = await getEnsAddress(config, {
            chainId: 1,
            name: normalize(value),
          });

          if (address) {
            const chainType = getChainTypeFromAddress(address);
            if (chainType) {
              return {
                address: address,
                addressType: 'ENS',
                chainType,
                isValid: true,
              };
            }
          }

          throw new Error();
        } catch (_) {
          return {
            isValid: false,
            error: t('error.title.walletAddressInvalid'),
          };
        }
      },
    },
  );

  return {
    validateAddress,
    isValidating,
  };
};
