import type { ChangeEvent, MutableRefObject } from 'react';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import ErrorIcon from '@mui/icons-material/Error';
import { Button } from '@mui/material';
import type { ChainType } from '@lifi/sdk';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { BottomSheet } from '../../components/BottomSheet';
import { useAddressAndENSValidation } from '../../hooks';
import {
  AddressInput,
  BookmarkInputFields,
  IconContainer,
  NameInput,
  SendToWalletButtonRow,
  SendToWalletCard,
  SendToWalletSheetContainer,
  SheetAddress,
  SheetTitle,
  ValidationAlert,
} from './SendToWalletPage.style';
import type { AddressType, BookmarkedWallet } from '../../stores';
import { useBookmarksActions } from '../../stores';

interface BookmarkAddressProps {
  onAddBookmark: (
    name: string,
    address: string,
    addressType: AddressType,
    chainType: ChainType,
  ) => void;
  validatedWallet?: BookmarkedWallet;
}
export const BookmarkAddressSheet = forwardRef<
  BottomSheetBase,
  BookmarkAddressProps
>(({ validatedWallet, onAddBookmark }, ref) => {
  const { t } = useTranslation();
  const [nameValue, setNameValue] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { validateAddressOrENS } = useAddressAndENSValidation();
  const { getBookmarkedWallet } = useBookmarksActions();
  const handleCancel = () => {
    (ref as MutableRefObject<BottomSheetBase>).current?.close();
  };

  const validateWithAddressFromInput = async () => {
    const addressValidationCheck = await validateAddressOrENS(addressValue);
    setErrorMessage(addressValidationCheck.error);
    if (!addressValidationCheck.isValid) {
      return;
    }

    return {
      name: nameValue.trim(),
      address: addressValue,
      addressType: addressValidationCheck.addressType,
      chainType: addressValidationCheck.chainType,
    };
  };

  const validateWithValidatedWallet = () => {
    setErrorMessage('');

    return {
      name: nameValue.trim(),
      address: validatedWallet!.address,
      addressType: validatedWallet!.addressType,
      chainType: validatedWallet!.chainType,
    };
  };
  const handleBookmark = async () => {
    if (!nameValue) {
      setErrorMessage(t('error.title.bookmarkNameRequired'));
      return;
    }

    const existingBookmarkWallet = getBookmarkedWallet(addressValue);
    if (existingBookmarkWallet) {
      setErrorMessage(
        t('error.title.bookmarkAlreadyExists', {
          name: existingBookmarkWallet.name,
        }),
      );
      return;
    }

    //  If the validatedWallet is supplied as a prop then we should assume
    //  the address has already been validated
    const validatedBookmarkedWallet = validatedWallet
      ? validateWithValidatedWallet()
      : await validateWithAddressFromInput();

    if (validatedBookmarkedWallet) {
      (ref as MutableRefObject<BottomSheetBase>).current?.close();

      onAddBookmark(
        validatedBookmarkedWallet.name,
        validatedBookmarkedWallet.address,
        validatedBookmarkedWallet.addressType,
        validatedBookmarkedWallet.chainType,
      );
    }
  };

  const handleAddressInputChange = (e: ChangeEvent) => {
    setAddressValue((e.target as HTMLInputElement).value.trim());
  };

  const handleNameInputChange = (e: ChangeEvent) => {
    setNameValue((e.target as HTMLInputElement).value);
  };

  const resetValues = () => {
    setNameValue('');
    setAddressValue('');
  };

  return (
    <BottomSheet ref={ref} onClose={resetValues}>
      <SendToWalletSheetContainer>
        <IconContainer>
          <TurnedInIcon sx={{ fontSize: 48 }} />
        </IconContainer>
        <SheetTitle>{t('sendToWallet.bookmarkWallet')}</SheetTitle>
        {validatedWallet && (
          <SheetAddress>{validatedWallet.address}</SheetAddress>
        )}
        <BookmarkInputFields>
          <SendToWalletCard>
            <NameInput
              size="small"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onChange={handleNameInputChange}
              value={nameValue}
              placeholder={t('sendToWallet.enterName')}
              aria-label={t('sendToWallet.enterName')}
            />
          </SendToWalletCard>
          {!validatedWallet && (
            <SendToWalletCard>
              <AddressInput
                size="small"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onChange={handleAddressInputChange}
                value={addressValue}
                placeholder={t('sendToWallet.enterAddressOrENS')}
                aria-label={t('sendToWallet.enterAddressOrENS')}
                multiline
              />
            </SendToWalletCard>
          )}
          {!!errorMessage && (
            <ValidationAlert icon={<ErrorIcon />}>
              {errorMessage}
            </ValidationAlert>
          )}
        </BookmarkInputFields>
        <SendToWalletButtonRow>
          <Button sx={{ flexGrow: 1 }} variant="text" onClick={handleCancel}>
            {t('button.cancel')}
          </Button>
          <Button
            sx={{ flexGrow: 1 }}
            variant="contained"
            onClick={handleBookmark}
            focusRipple
          >
            {t('button.bookmark')}
          </Button>
        </SendToWalletButtonRow>
      </SendToWalletSheetContainer>
    </BottomSheet>
  );
});
