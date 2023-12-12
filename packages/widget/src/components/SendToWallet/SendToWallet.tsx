import type { BoxProps } from '@mui/material';
import { Collapse, FormHelperText } from '@mui/material';
import { getEnsAddress } from '@wagmi/core';
import type { ChangeEvent } from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { isAddress } from 'viem';
import { normalize } from 'viem/ens';
import { useConfig } from 'wagmi';
import { useAccount, useRequiredToAddress } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import {
  useFieldActions,
  useFieldController,
  useSendToWalletStore,
  useSettings,
  useValidation,
  useValidationActions,
} from '../../stores';
import { DisabledUI, HiddenUI } from '../../types';
import { isSVMAddress } from '../../utils';
import { Card, CardTitle } from '../Card';
import { FormControl, Input } from './SendToWallet.style';

export const SendToWallet: React.FC<BoxProps> = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { getFieldValues } = useFieldActions();
  const { name, value, onChange, onBlur } = useFieldController({
    name: 'toAddress',
  });
  const { addFieldValidation, triggerFieldValidation, clearErrors } =
    useValidationActions();
  const { account } = useAccount();
  const config = useConfig();
  const { disabledUI, hiddenUI, toAddress } = useWidgetConfig();
  const { showSendToWallet, showSendToWalletDirty } = useSendToWalletStore();
  const { showDestinationWallet } = useSettings(['showDestinationWallet']);

  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress);
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress);
  const requiredToAddress = useRequiredToAddress();
  const requiredToAddressRef = useRef(requiredToAddress);

  // We want to show toAddress field if it is set via widget configuration and not hidden
  const showInstantly =
    Boolean(
      !showSendToWalletDirty &&
        showDestinationWallet &&
        toAddress &&
        !hiddenToAddress,
    ) || requiredToAddress;

  useEffect(() => {
    addFieldValidation('toAddress', async (value: string) => {
      try {
        if (!value && requiredToAddress) {
          return t('error.title.walletEnsAddressInvalid');
        }

        if (!value || isAddress(value) || isSVMAddress(value)) {
          return true;
        }
        const address = await getEnsAddress(config, {
          chainId: getFieldValues('toChain')[0],
          name: normalize(value),
        });
        return Boolean(address);
      } catch (error) {
        return t('error.title.walletEnsAddressInvalid') as string;
      }
    });
  }, [addFieldValidation, requiredToAddress, getFieldValues, t, config]);

  const handlerInputChange = (e: ChangeEvent) => {
    onChange((e.target as HTMLInputElement).value.trim());
  };

  const handlerInputBlur = () => {
    onBlur();
    triggerFieldValidation('toAddress');
  };

  useEffect(() => {
    const value = getFieldValues('toAddress');
    if (value) {
      triggerFieldValidation('toAddress');
      // Trigger validation if we change requiredToAddress in the runtime
    } else if (requiredToAddressRef.current !== requiredToAddress) {
      requiredToAddressRef.current = requiredToAddress;
      triggerFieldValidation('toAddress').then(() => clearErrors('toAddress'));
    }
  }, [
    account.chainId,
    clearErrors,
    getFieldValues,
    requiredToAddress,
    triggerFieldValidation,
  ]);

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
            onChange={handlerInputChange}
            onBlur={handlerInputBlur}
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
  const { errors } = useValidation();

  return (
    <FormHelperText error={!!errors.toAddress}>
      {errors.toAddress as string}
    </FormHelperText>
  );
};
