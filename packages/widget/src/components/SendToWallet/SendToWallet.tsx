import { isAddress } from '@ethersproject/address';
import type { BoxProps } from '@mui/material';
import { FormHelperText } from '@mui/material';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey, useWallet } from '../../providers';
import { useSettings } from '../../stores';
import { Card, CardTitle } from '../Card';
import { FormControl, Input } from './SendToWallet.style';

export const SendToWallet: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const { showDestinationWallet } = useSettings(['showDestinationWallet']);
  const { account, provider } = useWallet();
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext();

  const { onChange, onBlur, name, ref } = register(SwapFormKey.ToAddress, {
    validate: async (value: string) => {
      try {
        if (!value) {
          return true;
        }
        const address = await provider?.resolveName(value);
        return (
          isAddress(address || value) ||
          t('swap.error.title.walletAddressInvalid')
        );
      } catch {
        return t('swap.error.title.walletEnsAddressInvalid');
      }
    },
    onBlur: () => trigger(SwapFormKey.ToAddress),
  });

  useEffect(() => {
    trigger(SwapFormKey.ToAddress);
  }, [account.chainId, trigger]);

  if (!showDestinationWallet) {
    return null;
  }

  return (
    <Card {...props}>
      <CardTitle>{t('swap.sendToWallet')}</CardTitle>
      <FormControl fullWidth>
        <Input
          ref={ref}
          size="small"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          placeholder={t('swap.walletAddressOrEns')}
        />
        <FormHelperText error={!!errors.toAddress}>
          {errors.toAddress?.message as string}
        </FormHelperText>
      </FormControl>
    </Card>
  );
};
