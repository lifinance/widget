import { isAddress } from '@ethersproject/address';
import InfoIcon from '@mui/icons-material/Info';
import { Button, FormHelperText } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useController, useFormContext, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FormKey, useWallet, useWidgetConfig } from '../../providers';
import { useSendToWalletStore, useSettings } from '../../stores';
import { DisabledUI, HiddenUI, RequiredUI } from '../../types';
import { navigationRoutes } from '../../utils';
import { Card } from '../../components/Card';
import {
  AlertSection,
  FormControl,
  Input,
  PageContainer,
} from './SendToWalletPage.styled';

export const SendToWalletPage = () => {
  const { t } = useTranslation();
  const { trigger, getValues, setValue, clearErrors } = useFormContext();
  const { account } = useWallet();
  const navigate = useNavigate();
  const { disabledUI, hiddenUI, requiredUI, toAddress } = useWidgetConfig();
  const { showSendToWalletDirty, setSendToWallet } = useSendToWalletStore();
  const { showDestinationWallet } = useSettings(['showDestinationWallet']);

  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress);
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress);
  const requiredToAddress = requiredUI?.includes(RequiredUI.ToAddress);
  const requiredToAddressRef = useRef(requiredToAddress);
  const {
    field: { onChange, onBlur, name, value },
    fieldState: { invalid },
  } = useController({
    name: FormKey.ToAddress,
    rules: {
      required:
        requiredToAddress && (t('error.title.walletAddressRequired') as string),
      onChange: (e) => {
        const trimmedValue = e.target.value.trim();
        setValue(FormKey.ToAddress, trimmedValue);
      },
      validate: async (value: string) => {
        try {
          if (!value) {
            return true;
          }
          const address = await account.signer?.provider?.resolveName(value);
          return (
            isAddress(address || value) ||
            (t('error.title.walletAddressInvalid') as string)
          );
        } catch {
          return t('error.title.walletEnsAddressInvalid') as string;
        }
      },
      onBlur: () => trigger(FormKey.ToAddress),
    },
  });
  // We want to show toAddress field if it is set via widget configuration and not hidden
  const showInstantly =
    Boolean(
      !showSendToWalletDirty &&
        showDestinationWallet &&
        toAddress &&
        !hiddenToAddress,
    ) || requiredToAddress;

  useEffect(() => {
    if (showInstantly) {
      setSendToWallet(true);
    }
  }, [showInstantly, setSendToWallet]);

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

  if (hiddenToAddress) {
    return null;
  }
  return (
    <PageContainer>
      <Card sx={{ marginTop: '16px', marginBottom: '8px' }}>
        <FormControl
          fullWidth
          sx={{
            paddingTop: '6px',
            paddingBottom: '5px',
          }}
        >
          <Input
            multiline
            sx={{ height: '96px', alignItems: 'flex-start' }}
            size="small"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            value={value}
            disabled={Boolean(toAddress && disabledToAddress)}
            placeholder={t('main.walletAddressOrEns') as string}
          />
        </FormControl>
      </Card>
      <SendToWalletFormHelperText />
      <AlertSection severity="info" icon={<InfoIcon />}>
        {t('info.message.fundsToExchange')}
      </AlertSection>
      <Button
        variant="contained"
        onClick={() => {
          if (!invalid) {
            navigate(navigationRoutes.home);
          }
        }}
        autoFocus
      >
        {t('button.confirm')}
      </Button>
    </PageContainer>
  );
};

export const SendToWalletFormHelperText: React.FC = () => {
  const { errors } = useFormState();

  return (
    <FormHelperText error={!!errors.toAddress}>
      {errors.toAddress?.message as string}
    </FormHelperText>
  );
};
