import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from 'wagmi';
import { isSVMAddress } from '../utils';
import { useRequiredToAddress } from '../hooks';
import { isAddress } from 'viem';
import { getEnsAddress } from '@wagmi/core';
import { normalize } from 'viem/ens';
import { useFieldActions } from '../stores';

export const useAddressAndENSValidation = () => {
  const { t } = useTranslation();
  const { getFieldValues } = useFieldActions();
  const config = useConfig();
  const requiredToAddress = useRequiredToAddress();

  const validateAddressOrENS = useCallback(
    async (value: string) => {
      try {
        if (!value || (!value && requiredToAddress)) {
          return {
            isValid: false,
            error: t('error.title.walletEnsAddressInvalid'),
          };
        }

        if (!value || isAddress(value) || isSVMAddress(value)) {
          return {
            isValid: true,
            error: '',
          };
        }

        const address = await getEnsAddress(config, {
          chainId: getFieldValues('toChain')[0],
          name: normalize(value),
        });

        return {
          isValid: !!address,
          error: '',
        };
      } catch (err) {
        return {
          isValid: false,
          error: t('error.title.walletEnsAddressInvalid'),
        };
      }

      return {
        isValid: false,
        error: t('error.title.walletEnsAddressInvalid'),
      };
    },
    [requiredToAddress, t, getFieldValues, config],
  );

  return {
    validateAddressOrENS,
  };
};
