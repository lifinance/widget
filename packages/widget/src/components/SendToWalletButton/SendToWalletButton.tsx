import type { BoxProps } from '@mui/material';
import { Collapse } from '@mui/material';
import { forwardRef, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FormKey, useWallet, useWidgetConfig } from '../../providers';
import { useSendToWalletStore, useSettings } from '../../stores';
import { HiddenUI, RequiredUI } from '../../types';
import { navigationRoutes } from '../../utils';
import { Card, CardTitle } from '../Card';
import { FormControl, Input } from './SendToWalletButton.style';

export const SendToWalletButton: React.FC<BoxProps> = forwardRef(
  (props, ref) => {
    const { t } = useTranslation();
    const { getValues } = useFormContext();
    const { account } = useWallet();
    const navigate = useNavigate();
    const { hiddenUI, requiredUI, toAddress } = useWidgetConfig();
    const { showSendToWallet, showSendToWalletDirty, setSendToWallet } =
      useSendToWalletStore();
    const { showDestinationWallet } = useSettings(['showDestinationWallet']);

    const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress);
    const requiredToAddress = requiredUI?.includes(RequiredUI.ToAddress);
    const requiredToAddressRef = useRef(requiredToAddress);

    const name = FormKey.ToAddress;
    const value = getValues(FormKey.ToAddress);

    const onClick = () => {
      navigate(navigationRoutes.sendToWallet);
    };

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
      const currentToAddress = getValues(FormKey.ToAddress);
      if (
        !currentToAddress &&
        requiredToAddressRef.current !== requiredToAddress
      ) {
        requiredToAddressRef.current = requiredToAddress;
      }
    }, [account.chainId, getValues, requiredToAddress]);

    if (hiddenToAddress) {
      return null;
    }

    return (
      <Collapse
        timeout={showInstantly ? 0 : 225}
        in={showSendToWallet || showInstantly}
        mountOnEnter
        unmountOnExit
      >
        <Card {...props} ref={ref} onClick={onClick}>
          <CardTitle required={requiredToAddress}>
            {t('main.sendToWallet')}
          </CardTitle>
          <FormControl
            fullWidth
            sx={{ paddingTop: '6px', paddingBottom: '5px' }}
          >
            <Input
              readOnly
              size="small"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              name={name}
              value={value}
              placeholder={t('main.walletAddressOrEns') as string}
            />
          </FormControl>
        </Card>
      </Collapse>
    );
  },
);
