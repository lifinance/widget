import type { BoxProps } from '@mui/material';
import { Collapse, FormHelperText } from '@mui/material';
import { getEnsAddress } from '@wagmi/core';
import { forwardRef, useEffect, useRef } from 'react';
import { useController, useFormContext, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isAddress } from 'viem';
import { normalize } from 'viem/ens';
import { useConfig } from 'wagmi';
import { useAccount } from '../../hooks';
import { FormKey, useWidgetConfig } from '../../providers';
import { useSendToWalletStore, useSettings } from '../../stores';
import { DisabledUI, HiddenUI, RequiredUI } from '../../types';
import { Card, CardTitle } from '../Card';
import { FormControl, Input } from './SendToWallet.style';
import { useDifferentChainType } from './useDifferentChainType';

export const SendToWallet: React.FC<BoxProps> = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { trigger, getValues, setValue, clearErrors } = useFormContext();
  const { account } = useAccount();
  const config = useConfig();
  const { disabledUI, hiddenUI, requiredUI, toAddress } = useWidgetConfig();
  const { showSendToWallet, showSendToWalletDirty } = useSendToWalletStore();
  const { showDestinationWallet } = useSettings(['showDestinationWallet']);

  const differentChainType = useDifferentChainType();

  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress);
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress);
  const requiredToAddress =
    requiredUI?.includes(RequiredUI.ToAddress) || differentChainType;
  const requiredToAddressRef = useRef(requiredToAddress);

  // We want to show toAddress field if it is set via widget configuration and not hidden
  const showInstantly =
    Boolean(
      !showSendToWalletDirty &&
        showDestinationWallet &&
        toAddress &&
        !hiddenToAddress,
    ) || requiredToAddress;

  const {
    field: { onChange, onBlur, name, value },
  } = useController({
    name: FormKey.ToAddress,
    rules: {
      required:
        requiredToAddress && (t('error.title.walletAddressRequired') as string),
      onChange: (e) => {
        setValue(FormKey.ToAddress, e.target.value.trim());
      },
      validate: async (value: string) => {
        return true;
        try {
          if (!value || isAddress(value)) {
            return true;
          }
          const address = await getEnsAddress(config, {
            name: normalize(value),
          });
          return Boolean(address);
        } catch {
          return t('error.title.walletEnsAddressInvalid') as string;
        }
      },
      onBlur: () => trigger(FormKey.ToAddress),
    },
  });

  // useEffect(() => {
  //   if (showInstantly) {
  //     setSendToWallet(true);
  //   }
  // }, [showInstantly, setSendToWallet]);

  useEffect(() => {
    const value = getValues(FormKey.ToAddress);
    if (value) {
      trigger(FormKey.ToAddress);
      // Trigger validation if we change requiredToAddress in the runtime
    } else if (requiredToAddressRef.current !== requiredToAddress) {
      requiredToAddressRef.current = requiredToAddress;
      trigger(FormKey.ToAddress).then(() => clearErrors(FormKey.ToAddress));
    }
  }, [account.chainId, clearErrors, getValues, requiredToAddress, trigger]);

  if (hiddenToAddress && !requiredToAddress) {
    return null;
  }

  return (
    <Collapse
      timeout={showInstantly ? 0 : 225}
      in={showSendToWallet || showInstantly}
      mountOnEnter
      unmountOnExit
    >
      <Card {...props} ref={ref}>
        <CardTitle required={requiredToAddress}>
          {t('main.sendToWallet')}
        </CardTitle>
        <FormControl fullWidth sx={{ paddingTop: '6px', paddingBottom: '5px' }}>
          <Input
            size="small"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            value={value}
            placeholder={t('main.walletAddressOrEns') as string}
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
