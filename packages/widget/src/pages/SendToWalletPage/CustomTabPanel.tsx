import { useState } from 'react';
import type { ChangeEvent } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../../utils';
import { DisabledUI } from '../../types';
import { useWidgetConfig } from '../../providers';
import { useAddressAndENSValidation } from '../../hooks';
import { useFieldActions } from '../../stores';
import { AlertSection } from '../../components/AlertSection';
import { TabPanelContainer, Input } from './SendToWalletPage.style';
export const CustomTabPanel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { disabledUI, toAddress } = useWidgetConfig();
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress);
  const { setFieldValue } = useFieldActions();

  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { validateAddressOrENS } = useAddressAndENSValidation();
  const handleInputChange = (e: ChangeEvent) => {
    setInputValue((e.target as HTMLInputElement).value.trim());
  };
  const handleConfirmClick = async () => {
    const validationCheck = await validateAddressOrENS(inputValue);

    setErrorMessage(validationCheck.error);

    if (validationCheck.isValid) {
      setFieldValue('toAddress', inputValue);
      navigate(navigationRoutes.home);
    }
  };

  return (
    <TabPanelContainer>
      <Input
        size="small"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onChange={handleInputChange}
        value={inputValue}
        name={'addressField'}
        placeholder={t('main.walletAddressOrEns')}
        aria-label={t('main.walletAddressOrEns')}
        disabled={!!(toAddress && disabledToAddress)}
        multiline
      />
      {!!errorMessage && (
        <AlertSection severity="error" icon={<ErrorIcon />}>
          {errorMessage}
        </AlertSection>
      )}
      <AlertSection severity="info" icon={<InfoIcon />}>
        {t('info.message.fundsToExchange')}
      </AlertSection>
      <Button variant="contained" onClick={handleConfirmClick} disableRipple>
        {t('button.confirm')}
      </Button>
    </TabPanelContainer>
  );
};
