import { isAddress } from '@ethersproject/address';
import type { BoxProps } from '@mui/material';
import { Collapse, FormHelperText } from '@mui/material';
import { forwardRef, useEffect } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey, useWallet, useWidgetConfig } from '../../providers';
import { DisabledUI } from '../../types';
import { Card, CardTitle } from '../Card';
import { FormControl, Input } from './SendToWallet.style';
import { useSendToWalletStore } from './store';

export const SendToWallet: React.FC<BoxProps> = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { disabledUI } = useWidgetConfig();
  const showSendToWallet = useSendToWalletStore(
    (state) => state.showSendToWallet,
  );
  const { account, provider } = useWallet();
  const { register, trigger } = useFormContext();

  useEffect(() => {
    trigger(SwapFormKey.ToAddress);
  }, [account.chainId, trigger]);

  if (disabledUI?.includes(DisabledUI.ToAddress)) {
    return null;
  }

  const {
    onChange,
    onBlur,
    name,
    ref: inputRef,
  } = register(SwapFormKey.ToAddress, {
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

  return (
    <Collapse timeout={225} in={showSendToWallet} mountOnEnter unmountOnExit>
      <Card {...props} ref={ref}>
        <CardTitle>{t('swap.sendToWallet')}</CardTitle>
        <FormControl fullWidth sx={{ paddingTop: '6px', paddingBottom: '5px' }}>
          <Input
            ref={inputRef}
            size="small"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            placeholder={t('swap.walletAddressOrEns')}
            autoFocus
          />
          <SendToWalletFormHelperText />
        </FormControl>
      </Card>
    </Collapse>
  );
});

export const SendToWalletFormHelperText: React.FC = () => {
  const { errors } = useFormState();

  return (
    <FormHelperText error={!!errors.toAddress}>
      {errors.toAddress?.message as string}
    </FormHelperText>
  );
};
