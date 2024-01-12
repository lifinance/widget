import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';
import HistoryIcon from '@mui/icons-material/History';
import WalletIcon from '@mui/icons-material/Wallet';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import type { ChainType } from '@lifi/sdk';
import { navigationRoutes } from '../../utils';
import { AlertSection } from '../../components/AlertSection';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { CardButton } from '../../components/Card';
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
import {
  AddressType,
  BookmarkedWallet,
  useBookmarks,
  useBookmarksActions,
} from '../../stores';

export const SendToWalletPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookmarkedWallets, recentWallets } = useBookmarks();
  const {
    addBookmarkedWallet,
    getBookmarkedWallet,
    setSelectedBookmarkWallet,
    addRecentWallet,
  } = useBookmarksActions();
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null);
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const [inputAddressValue, setInputAddressValue] = useState('');
  const [validatedWallet, setValidatedWallet] = useState<
    BookmarkedWallet | undefined
  >();
  const [errorMessage, setErrorMessage] = useState('');
  const { validateAddressOrENS } = useAddressAndENSValidation();

  const handleInputChange = (e: ChangeEvent) => {
    setInputAddressValue((e.target as HTMLInputElement).value.trim());
  };
  const handleDone = async () => {
    const validationCheck = await validateAddressOrENS(inputAddressValue);

    setErrorMessage(validationCheck.error);

    if (validationCheck.isValid) {
      setValidatedWallet({
        address: inputAddressValue,
        addressType: validationCheck.addressType,
        chainType: validationCheck.chainType,
      });
      confirmAddressSheetRef.current?.open();
    }
  };

  const handleBookmarkAddress = async () => {
    const existingBookmarkWallet = getBookmarkedWallet(inputAddressValue);
    if (existingBookmarkWallet) {
      setErrorMessage(
        t('error.title.bookmarkAlreadyExists', {
          name: existingBookmarkWallet.name,
        }),
      );
      return;
    }

    const validationCheck = await validateAddressOrENS(inputAddressValue);

    setErrorMessage(validationCheck.error);

    if (validationCheck.isValid) {
      setValidatedWallet({
        address: inputAddressValue,
        addressType: validationCheck.addressType,
        chainType: validationCheck.chainType,
      });
      bookmarkAddressSheetRef.current?.open();
    }
  };

  const handleRecentWalletsClick = () => {
    navigate(navigationRoutes.recentWallets);
  };
  const handleBookmarkedWalletsClick = () => {
    navigate(navigationRoutes.bookmarkedWallets);
  };

  const handleAddBookmark = (
    name: string,
    address: string,
    addressType: AddressType,
    chainType: ChainType,
  ) => {
    addBookmarkedWallet(name, address, addressType, chainType);
    navigate(navigationRoutes.bookmarkedWallets);
  };

  const handleOnConfirm = () => {
    setSelectedBookmarkWallet();
    console.log('validatedWallet', validatedWallet);
    addRecentWallet(
      validatedWallet!.address,
      validatedWallet!.addressType,
      validatedWallet!.chainType,
    );
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
          value={inputAddressValue}
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
          validatedWallet={validatedWallet}
          onConfirm={handleOnConfirm}
        />
        <BookmarkAddressSheet
          ref={bookmarkAddressSheetRef}
          validatedWallet={validatedWallet}
          onAddBookmark={handleAddBookmark}
        />
      </SendToWalletCard>

      <CardButton
        title={t('sendToWallet.recentWallets')}
        icon={<HistoryIcon />}
        onClick={handleRecentWalletsClick}
      >
        {!!recentWallets.length && (
          <WalletNumber>{recentWallets.length}</WalletNumber>
        )}
      </CardButton>

      <CardButton
        title={t('sendToWallet.connectedWallets')}
        icon={<WalletIcon />}
        onClick={() => {}}
      >
        <WalletNumber>3</WalletNumber>
      </CardButton>

      <CardButton
        title={t('header.bookmarkedWallets')}
        icon={<TurnedInIcon />}
        onClick={handleBookmarkedWalletsClick}
      >
        {!!bookmarkedWallets.length && (
          <WalletNumber>{bookmarkedWallets.length}</WalletNumber>
        )}
      </CardButton>
    </SendToWalletPageContainer>
  );
};
