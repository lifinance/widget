import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorIcon from '@mui/icons-material/Error';
import HistoryIcon from '@mui/icons-material/History';
import WalletIcon from '@mui/icons-material/Wallet';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { DisabledUI } from '../../types';
import { useWidgetConfig } from '../../providers';
import { AlertSection } from '../../components/AlertSection';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { CardButton } from '../../components/CardButton';
import { useAddressAndENSValidation } from '../../hooks';
import {
  Input,
  PageContainer,
  SendToWalletButtonRow,
  SendToWalletCard,
  SendToWalletButton,
  WalletNumber,
  SendToWalletIconButton,
} from './SendToWalletPage.style';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';

export const SendToWalletPage = () => {
  const { t } = useTranslation();
  const { disabledUI, toAddress } = useWidgetConfig();
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress);

  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { validateAddressOrENS } = useAddressAndENSValidation();
  const handleInputChange = (e: ChangeEvent) => {
    setInputValue((e.target as HTMLInputElement).value.trim());
  };

  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const handleDone = async () => {
    const validationCheck = await validateAddressOrENS(inputValue);

    setErrorMessage(validationCheck.error);

    if (validationCheck.isValid) {
      confirmAddressSheetRef.current?.open();
    }
  };

  const handleBookmarkAddress = () => {};

  return (
    <PageContainer>
      <SendToWalletCard mb={3}>
        {!!errorMessage && (
          <AlertSection
            severity="error"
            icon={<ErrorIcon />}
            sx={{ padding: '0' }}
          >
            {errorMessage}
          </AlertSection>
        )}
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
        <SendToWalletButtonRow>
          <SendToWalletButton
            variant="text"
            onClick={handleDone}
            sx={{ flexGrow: 1 }}
            disableRipple
          >
            {t('button.done')}
          </SendToWalletButton>
          <SendToWalletIconButton onClick={handleBookmarkAddress} disableRipple>
            <TurnedInIcon fontSize="small" />
          </SendToWalletIconButton>
        </SendToWalletButtonRow>
        <ConfirmAddressSheet
          ref={confirmAddressSheetRef}
          address={inputValue}
        />
      </SendToWalletCard>

      <CardButton
        title={t('sendToWallet.recentWallets')}
        icon={<HistoryIcon />}
        onClick={() => {}}
      >
        <WalletNumber>3</WalletNumber>
      </CardButton>

      <CardButton
        title={t('sendToWallet.connectedWallets')}
        icon={<WalletIcon />}
        onClick={() => {}}
      >
        <WalletNumber>3</WalletNumber>
      </CardButton>

      <CardButton
        title={t('sendToWallet.bookmarkedWallets')}
        icon={<TurnedInIcon />}
        onClick={() => {}}
      >
        <WalletNumber>3</WalletNumber>
      </CardButton>
    </PageContainer>
  );
};
