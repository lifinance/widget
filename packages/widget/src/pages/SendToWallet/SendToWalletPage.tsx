import { Error, History, TurnedIn, Wallet } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { BottomSheetBase } from '../../components/BottomSheet/types.js';
import { CardButton } from '../../components/Card/CardButton.js';
import { useAccount } from '../../hooks/useAccount.js';
import { useAddressValidation } from '../../hooks/useAddressValidation.js';
import { useChain } from '../../hooks/useChain.js';
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js';
import type { Bookmark } from '../../stores/bookmarks/types.js';
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js';
import { useBookmarks } from '../../stores/bookmarks/useBookmarks.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { BookmarkAddressSheet } from './BookmarkAddressSheet.js';
import { ConfirmAddressSheet } from './ConfirmAddressSheet.js';
import {
  AddressInput,
  SendToWalletButton,
  SendToWalletButtonRow,
  SendToWalletCard,
  SendToWalletIconButton,
  SendToWalletPageContainer,
  ValidationAlert,
  WalletNumber,
} from './SendToWalletPage.style.js';

export const SendToWalletPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookmarks, recentWallets } = useBookmarks();
  const { addBookmark, getBookmark, setSelectedBookmark, addRecentWallet } =
    useBookmarkActions();
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null);
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const [inputAddressValue, setInputAddressValue] = useState('');
  const [validatedWallet, setValidatedWallet] = useState<Bookmark>();
  const [errorMessage, setErrorMessage] = useState('');
  const { validateAddress, isValidating } = useAddressValidation();
  const { accounts } = useAccount();
  const connectedWallets = accounts.filter((account) => account.isConnected);
  const { requiredToChainType } = useToAddressRequirements();
  const [toChainId] = useFieldValues('toChain');
  const { chain: toChain } = useChain(toChainId);

  const handleInputChange = (e: ChangeEvent) => {
    if (errorMessage) {
      setErrorMessage('');
    }
    setInputAddressValue((e.target as HTMLInputElement).value.trim());
  };

  const handleDone = async () => {
    if (isValidating) {
      return;
    }
    if (!inputAddressValue) {
      setErrorMessage(t('error.title.addressRequired'));
      return;
    }

    const validationResult = await validateAddress(inputAddressValue);
    if (!validationResult.isValid) {
      setErrorMessage(validationResult.error);
      return;
    }

    if (
      requiredToChainType &&
      requiredToChainType !== validationResult.chainType
    ) {
      setErrorMessage(
        t('error.title.walletChainTypeInvalid', {
          chainName: toChain?.name,
        }),
      );
      return;
    }

    setValidatedWallet({
      name:
        validationResult.addressType === 'ENS' ? inputAddressValue : undefined,
      address: validationResult.address,
      chainType: validationResult.chainType,
    });
    confirmAddressSheetRef.current?.open();
  };

  const handleBookmarkAddress = async () => {
    if (isValidating) {
      return;
    }
    if (!inputAddressValue) {
      setErrorMessage(t('error.title.addressRequired'));
      return;
    }

    const existingBookmarkWallet = getBookmark(inputAddressValue);
    if (existingBookmarkWallet) {
      setErrorMessage(
        t('error.title.bookmarkAlreadyExists', {
          name: existingBookmarkWallet.name,
        }),
      );
      return;
    }

    const validationResult = await validateAddress(inputAddressValue);

    if (validationResult.isValid) {
      setValidatedWallet({
        name:
          validationResult.addressType === 'ENS'
            ? inputAddressValue
            : undefined,
        address: validationResult.address,
        chainType: validationResult.chainType,
      });
      bookmarkAddressSheetRef.current?.open();
    } else {
      setErrorMessage(validationResult.error);
    }
  };

  const handleRecentWalletsClick = () => {
    navigate(navigationRoutes.recentWallets);
  };

  const handleConnectedWalletsClick = () => {
    navigate(navigationRoutes.connectedWallets);
  };
  const handleBookmarkedWalletsClick = () => {
    navigate(navigationRoutes.bookmarks);
  };

  const handleAddBookmark = (bookmark: Bookmark) => {
    addBookmark(bookmark);
    navigate(navigationRoutes.bookmarks);
  };

  const handleOnConfirm = (confirmedWallet: Bookmark) => {
    setSelectedBookmark(confirmedWallet);
    addRecentWallet(confirmedWallet);
  };

  return (
    <SendToWalletPageContainer topBottomGutters>
      <SendToWalletCard mb={6} variant={errorMessage ? 'error' : 'default'}>
        <AddressInput
          size="small"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          onChange={handleInputChange}
          value={inputAddressValue}
          placeholder={t('sendToWallet.enterAddress')}
          aria-label={t('sendToWallet.enterAddress')}
          maxRows={2}
          inputProps={{ maxLength: 128 }}
          multiline
        />
        {errorMessage ? (
          <ValidationAlert icon={<Error />} sx={{ pb: 2, paddingX: 2 }}>
            {errorMessage}
          </ValidationAlert>
        ) : null}
        <SendToWalletButtonRow sx={{ paddingX: 2, paddingBottom: 2 }}>
          <SendToWalletButton
            variant="text"
            onClick={handleDone}
            sx={{ flexGrow: 1 }}
          >
            {t('button.done')}
          </SendToWalletButton>
          <Tooltip title={t('button.bookmark')} arrow>
            <SendToWalletIconButton onClick={handleBookmarkAddress}>
              <TurnedIn fontSize="small" />
            </SendToWalletIconButton>
          </Tooltip>
        </SendToWalletButtonRow>
        <ConfirmAddressSheet
          ref={confirmAddressSheetRef}
          validatedBookmark={validatedWallet}
          onConfirm={handleOnConfirm}
        />
        <BookmarkAddressSheet
          ref={bookmarkAddressSheetRef}
          validatedWallet={validatedWallet}
          onAddBookmark={handleAddBookmark}
        />
      </SendToWalletCard>
      <CardButton
        title={t('header.recentWallets')}
        icon={<History />}
        onClick={handleRecentWalletsClick}
      >
        {!!recentWallets.length && (
          <WalletNumber>{recentWallets.length}</WalletNumber>
        )}
      </CardButton>
      <CardButton
        title={t('sendToWallet.connectedWallets')}
        icon={<Wallet />}
        onClick={handleConnectedWalletsClick}
      >
        {!!connectedWallets.length && (
          <WalletNumber>{connectedWallets.length}</WalletNumber>
        )}
      </CardButton>
      <CardButton
        title={t('header.bookmarkedWallets')}
        icon={<TurnedIn />}
        onClick={handleBookmarkedWalletsClick}
      >
        {!!bookmarks.length && <WalletNumber>{bookmarks.length}</WalletNumber>}
      </CardButton>
    </SendToWalletPageContainer>
  );
};
