import type { ChainType } from '@lifi/sdk';
import ErrorIcon from '@mui/icons-material/Error';
import HistoryIcon from '@mui/icons-material/History';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import WalletIcon from '@mui/icons-material/Wallet';
import { Tooltip } from '@mui/material';
import type { ChangeEvent, FocusEventHandler } from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { CardButton } from '../../components/Card';
import {
  useAccount,
  useAddressValidation,
  useChain,
  useToAddressRequirements,
} from '../../hooks';
import type { AddressType, Bookmark } from '../../stores';
import { useBookmarkActions, useBookmarks, useFieldValues } from '../../stores';
import { navigationRoutes } from '../../utils';
import { BookmarkAddressSheet } from './BookmarkAddressSheet';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
import {
  AddressInput,
  SendToWalletButton,
  SendToWalletButtonRow,
  SendToWalletCard,
  SendToWalletIconButton,
  SendToWalletPageContainer,
  ValidationAlert,
  WalletNumber,
} from './SendToWalletPage.style';

export const SendToWalletPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookmarks: bookmarkedWallets, recentWallets } = useBookmarks();
  const { addBookmark, getBookmark, setSelectedBookmark, addRecentWallet } =
    useBookmarkActions();
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null);
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const doneButtonRef = useRef<HTMLButtonElement>(null);
  const boomarkButtonRef = useRef<HTMLButtonElement>(null);
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

    const validationCheck = await validateAddress(inputAddressValue);
    if (!validationCheck.isValid) {
      setErrorMessage(validationCheck.error);
      return;
    }

    if (
      requiredToChainType &&
      requiredToChainType !== validationCheck.chainType
    ) {
      setErrorMessage(
        t('error.title.walletChainTypeInvalid', {
          chainName: toChain?.name,
        }),
      );
      return;
    }

    setValidatedWallet({
      address: inputAddressValue,
      addressType: validationCheck.addressType,
      chainType: validationCheck.chainType,
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

    const validationCheck = await validateAddress(inputAddressValue);

    if (validationCheck.isValid) {
      setValidatedWallet({
        address: inputAddressValue,
        addressType: validationCheck.addressType,
        chainType: validationCheck.chainType,
      });
      bookmarkAddressSheetRef.current?.open();
    } else {
      setErrorMessage(validationCheck.error);
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

  const handleAddBookmark = (
    name: string,
    address: string,
    addressType: AddressType,
    chainType: ChainType,
  ) => {
    addBookmark(name, address, addressType, chainType);
    navigate(navigationRoutes.bookmarks);
  };

  const handleOnConfirm = (confirmedWallet: Bookmark) => {
    setSelectedBookmark(confirmedWallet);
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
      if (!inputAddressValue) {
        return;
      }
      const validationCheck = await validateAddress(inputAddressValue);
      if (!validationCheck.isValid) {
        setErrorMessage(validationCheck.error);
      }
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
          placeholder={t('sendToWallet.enterAddress')}
          aria-label={t('sendToWallet.enterAddress')}
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
