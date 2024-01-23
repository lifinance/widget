import type { ChainType } from '@lifi/sdk';
import { useMutation } from '@tanstack/react-query';
import { getEnsAddress } from '@wagmi/core';
import { useTranslation } from 'react-i18next';
import { normalize } from 'viem/ens';
import { useConfig } from 'wagmi';
import { useToAddressRequirements } from '../hooks';
import type { AddressType } from '../stores';
import { useFieldActions } from '../stores';
import { getChainTypeFromAddress } from '../utils';

type ValidResponse = {
  isValid: true;
  chainType: ChainType;
  addressType: AddressType;
};

type InvalidResponse = {
  isValid: false;
  error: string;
};

export const useAddressValidation = () => {
  const { t } = useTranslation();
  const { getFieldValues } = useFieldActions();
  const config = useConfig();
  const requiredToAddress = useToAddressRequirements();

  const { mutateAsync: validateAddress, isPending: isValidating } = useMutation(
    {
      mutationFn: async (
        value: string,
      ): Promise<ValidResponse | InvalidResponse> => {
        try {
          if (!value || (!value && requiredToAddress)) {
            throw new Error();
          }

          const chainType = getChainTypeFromAddress(value);
          if (chainType) {
            return {
              isValid: true,
              chainType,
              addressType: 'address',
            };
          }

          const address = await getEnsAddress(config, {
            chainId: getFieldValues('toChain')[0],
            name: normalize(value),
          });

          if (address) {
            const chainType = getChainTypeFromAddress(address);
            if (chainType) {
              return {
                isValid: true,
                chainType,
                addressType: 'ENS',
              };
            }
          }

          throw new Error();
        } catch {
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
