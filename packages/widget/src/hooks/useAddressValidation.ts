import { useTranslation } from 'react-i18next';
import { useConfig } from 'wagmi';
import type { ChainType } from '@lifi/sdk';
import { getEnsAddress } from '@wagmi/core';
import { useToAddressRequirements } from '../hooks';
import { normalize } from 'viem/ens';
import { useFieldActions } from '../stores';
import type { AddressType } from '../stores';
import { getChainTypeFromAddress } from '../utils';
import { useMutation } from '@tanstack/react-query';

type ValidResponse = {
  isValid: true;
  error: string;
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

          if (value) {
            const chainType = getChainTypeFromAddress(value);
            if (chainType) {
              return {
                isValid: true,
                error: '',
                chainType,
                addressType: 'address',
              };
            }
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
                error: '',
                chainType,
                addressType: 'ENS',
              };
            }
          }

          throw new Error();
        } catch {
          return {
            isValid: false,
            error: t('error.title.walletAddressOrENSInvalid'),
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
