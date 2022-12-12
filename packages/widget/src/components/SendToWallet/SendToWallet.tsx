import { isAddress } from '@ethersproject/address';
import type { BoxProps } from '@mui/material';
import { Collapse, FormHelperText } from '@mui/material';
import { forwardRef, useEffect } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey, useWallet, useWidgetConfig } from '../../providers';
import { useSendToWalletStore, useSettings } from '../../stores';
import { DisabledUI, HiddenUI } from '../../types';
import { Card, CardTitle } from '../Card';
import { FormControl, Input } from './SendToWallet.style';

export const SendToWallet: React.FC<BoxProps> = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { register, trigger } = useFormContext();
  const { account, provider } = useWallet();
  const { disabledUI, hiddenUI, toAddress } = useWidgetConfig();
  const { showSendToWallet, showSendToWalletDirty, setSendToWallet } =
    useSendToWalletStore();
  const { showDestinationWallet } = useSettings(['showDestinationWallet']);

  useEffect(() => {
    trigger(SwapFormKey.ToAddress);
  }, [account.chainId, trigger]);

  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress);
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress);

  // We want to show toAddress field if it is set via widget configuration, disabled for changes, but not hidden
  const showInstantly = Boolean(
    !showSendToWalletDirty &&
      toAddress &&
      disabledToAddress &&
      showDestinationWallet &&
      !hiddenToAddress,
  );

  useEffect(() => {
    if (showInstantly) {
      setSendToWallet(true);
    }
  }, [showInstantly, setSendToWallet]);

  if (hiddenToAddress) {
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
          (t('swap.error.title.walletAddressInvalid') as string)
        );
      } catch {
        return t('swap.error.title.walletEnsAddressInvalid') as string;
      }
    },
    onBlur: () => trigger(SwapFormKey.ToAddress),
  });

  return (
    <Collapse
      timeout={showInstantly ? 0 : 225}
      in={showSendToWallet || showInstantly}
      mountOnEnter
      unmountOnExit
    >
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
            placeholder={t('swap.walletAddressOrEns') as string}
            disabled={Boolean(toAddress && disabledToAddress)}
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
