import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';
import HistoryIcon from '@mui/icons-material/History';
import WalletIcon from '@mui/icons-material/Wallet';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { navigationRoutes } from '../../utils';
import { AlertSection } from '../../components/AlertSection';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { CardButton } from '../../components/CardButton';
import { useAddressAndENSValidation } from '../../hooks';
import {
  AddressInput,
  SendToWalletPageContainer,
  SendToWalletButtonRow,
  SendToWalletCard,
  SendToWalletButton,
  WalletNumber,
  SendToWalletIconButton,
} from './SendToWalletPage.style';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
import { BookmarkAddressSheet } from './BookmarkAddressSheet';
import { useBookmarks } from '../../stores';

export const SendToWalletPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookmarks } = useBookmarks();
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null);
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { validateAddressOrENS } = useAddressAndENSValidation();

  const handleInputChange = (e: ChangeEvent) => {
    setInputValue((e.target as HTMLInputElement).value.trim());
  };
  const handleDone = async () => {
    const validationCheck = await validateAddressOrENS(inputValue);

    setErrorMessage(validationCheck.error);

    if (validationCheck.isValid) {
      confirmAddressSheetRef.current?.open();
    }
  };

  const handleBookmarkAddress = async () => {
    const validationCheck = await validateAddressOrENS(inputValue);

    setErrorMessage(validationCheck.error);

    if (validationCheck.isValid) {
      bookmarkAddressSheetRef.current?.open();
    }
  };

  const handleBookmarkedWalletsClick = () => {
    navigate(navigationRoutes.bookmarkedWallets);
  };

  return (
    <SendToWalletPageContainer topBottomGutters>
      <SendToWalletCard mb={3}>
        <AddressInput
          size="small"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          onChange={handleInputChange}
          value={inputValue}
          placeholder={t('sendToWallet.enterAddressOrENS')}
          aria-label={t('sendToWallet.enterAddressOrENS')}
          multiline
        />
        {!!errorMessage && (
          <AlertSection
            severity="error"
            icon={<ErrorIcon />}
            sx={{ padding: '0' }}
          >
            {errorMessage}
          </AlertSection>
        )}
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
        <BookmarkAddressSheet
          ref={bookmarkAddressSheetRef}
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
        onClick={handleBookmarkedWalletsClick}
      >
        {!!bookmarks.length && <WalletNumber>{bookmarks.length}</WalletNumber>}
      </CardButton>
    </SendToWalletPageContainer>
  );
};
