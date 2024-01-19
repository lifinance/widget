import { FocusEventHandler, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import HistoryIcon from '@mui/icons-material/History';
import WalletIcon from '@mui/icons-material/Wallet';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import type { ChainType } from '@lifi/sdk';
import { navigationRoutes } from '../../utils';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { CardButton } from '../../components/Card';
import {
  useAccount,
  useAddressValidation,
  useChain,
  useToAddressRequirements,
} from '../../hooks';
import {
  AddressInput,
  SendToWalletPageContainer,
  SendToWalletButtonRow,
  SendToWalletCard,
  SendToWalletButton,
  WalletNumber,
  SendToWalletIconButton,
  ValidationAlert,
} from './SendToWalletPage.style';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
import { BookmarkAddressSheet } from './BookmarkAddressSheet';
import {
  AddressType,
  BookmarkedWallet,
  useBookmarks,
  useBookmarksActions,
  useFieldValues,
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
  const doneButtonRef = useRef<HTMLButtonElement>(null);
  const boomarkButtonRef = useRef<HTMLButtonElement>(null);
  const [inputAddressValue, setInputAddressValue] = useState('');
  const [validatedWallet, setValidatedWallet] = useState<
    BookmarkedWallet | undefined
  >();
  const [errorMessage, setErrorMessage] = useState('');
  const { validateAddress, isValidating } = useAddressValidation();
  const { accounts } = useAccount();
  const connectedWallets = accounts.filter((account) => account.isConnected);
  const { requiredToChainType } = useToAddressRequirements();
  const [toChainId] = useFieldValues('toChain');
  const { chain: toChain } = useChain(toChainId);

  const handleInputChange = (e: ChangeEvent) => {
    setInputAddressValue((e.target as HTMLInputElement).value.trim());
  };

  const handleDone = async () => {
    if (!isValidating) {
      const validationCheck = await validateAddress(inputAddressValue);

      setErrorMessage(validationCheck.error);

      let validChain = true;
      if (
        requiredToChainType &&
        validationCheck.isValid &&
        validationCheck.chainType !== requiredToChainType
      ) {
        validChain = false;
        setErrorMessage(
          t('error.title.walletChainTypeInvalid', {
            chainName: toChain?.name,
          }),
        );
      }

      if (validChain && validationCheck.isValid) {
        setValidatedWallet({
          address: inputAddressValue,
          addressType: validationCheck.addressType,
          chainType: validationCheck.chainType,
        });
        confirmAddressSheetRef.current?.open();
      }
    }
  };

  const handleBookmarkAddress = async () => {
    if (!isValidating) {
      const existingBookmarkWallet = getBookmarkedWallet(inputAddressValue);
      if (existingBookmarkWallet) {
        setErrorMessage(
          t('error.title.bookmarkAlreadyExists', {
            name: existingBookmarkWallet.name,
          }),
        );
        return;
      }

      const validationCheck = await validateAddress(inputAddressValue);

      setErrorMessage(validationCheck.error);

      if (validationCheck.isValid) {
        setValidatedWallet({
          address: inputAddressValue,
          addressType: validationCheck.addressType,
          chainType: validationCheck.chainType,
        });
        bookmarkAddressSheetRef.current?.open();
      }
    }
  };

  const handleRecentWalletsClick = () => {
    navigate(navigationRoutes.recentWallets);
  };

  const handleConnectedWalletsClick = () => {
    navigate(navigationRoutes.connectedWallets);
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

  const handleOnConfirm = (confirmedWallet: BookmarkedWallet) => {
    setSelectedBookmarkWallet(confirmedWallet);
    addRecentWallet(
      confirmedWallet.address,
      confirmedWallet.addressType,
      confirmedWallet.chainType,
    );
  };

  const handleOnBlur: FocusEventHandler = async (e) => {
    if (
      !(
        e.relatedTarget === doneButtonRef.current ||
        e.relatedTarget === boomarkButtonRef.current
      ) &&
      !isValidating
    ) {
      const validationCheck = await validateAddress(inputAddressValue);
      setErrorMessage(validationCheck.error);
    }
  };

  return (
    <SendToWalletPageContainer topBottomGutters>
      <SendToWalletCard mb={1.5}>
        <AddressInput
          size="small"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          onChange={handleInputChange}
          onBlur={handleOnBlur}
          value={inputAddressValue}
          placeholder={t('sendToWallet.enterAddressOrENS')}
          aria-label={t('sendToWallet.enterAddressOrENS')}
          multiline
        />
        {!!errorMessage && (
          <ValidationAlert icon={<ErrorIcon />} sx={{ pb: 2, paddingX: 2 }}>
            {errorMessage}
          </ValidationAlert>
        )}
        <SendToWalletButtonRow sx={{ paddingX: 2, paddingBottom: 2 }}>
          <SendToWalletButton
            ref={doneButtonRef}
            variant="text"
            onClick={handleDone}
            sx={{ flexGrow: 1 }}
          >
            {t('button.done')}
          </SendToWalletButton>
          <Tooltip title={t('button.bookmark')} arrow>
            <SendToWalletIconButton
              ref={boomarkButtonRef}
              onClick={handleBookmarkAddress}
            >
              <TurnedInIcon fontSize="small" />
            </SendToWalletIconButton>
          </Tooltip>
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
        title={t('header.recentWallets')}
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
        onClick={handleConnectedWalletsClick}
      >
        {!!connectedWallets.length && (
          <WalletNumber>{connectedWallets.length}</WalletNumber>
        )}
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
