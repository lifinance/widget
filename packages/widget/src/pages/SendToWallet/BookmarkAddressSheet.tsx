import type { ChainType } from '@lifi/sdk';
import ErrorIcon from '@mui/icons-material/Error';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { Button } from '@mui/material';
import type { ChangeEvent, FocusEventHandler, MutableRefObject } from 'react';
import { forwardRef, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { BottomSheet } from '../../components/BottomSheet';
import { Input } from '../../components/Input';
import { useAddressValidation } from '../../hooks';
import type { AddressType, Bookmark } from '../../stores';
import { useBookmarkActions } from '../../stores';
import {
  AddressInput,
  BookmarkInputFields,
  IconContainer,
  SendToWalletButtonRow,
  SendToWalletCard,
  SendToWalletSheetContainer,
  SheetAddress,
  SheetTitle,
  ValidationAlert,
} from './SendToWalletPage.style';

interface BookmarkAddressProps {
  onAddBookmark: (
    name: string,
    address: string,
    addressType: AddressType,
    chainType: ChainType,
  ) => void;
  validatedWallet?: Bookmark;
}
export const BookmarkAddressSheet = forwardRef<
  BottomSheetBase,
  BookmarkAddressProps
>(({ validatedWallet, onAddBookmark }, ref) => {
  const { t } = useTranslation();
  const bookmarkButtonRef = useRef<HTMLButtonElement>(null);
  const [nameValue, setNameValue] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { validateAddress, isValidating } = useAddressValidation();
  const { getBookmark } = useBookmarkActions();
  const handleCancel = () => {
    setErrorMessage('');
    (ref as MutableRefObject<BottomSheetBase>).current?.close();
  };

  const validateWithAddressFromInput = async () => {
    const addressValidationCheck = await validateAddress(addressValue);
    if (!addressValidationCheck.isValid) {
      setErrorMessage(addressValidationCheck.error);
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
    if (errorMessage) {
      setErrorMessage('');
    }
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
    if (!addressValue) {
      setErrorMessage(t('error.title.addressRequired'));
      return;
    }

    const existingBookmarkWallet = getBookmark(addressValue);
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
    setNameValue((e.target as HTMLInputElement).value.trim());
  };

  const resetValues = () => {
    setNameValue('');
    setAddressValue('');
  };

  const handleAddressInputOnBlur: FocusEventHandler = async (e) => {
    if (!(e.relatedTarget === bookmarkButtonRef.current) && !isValidating) {
      if (!addressValue) {
        return;
      }

      const existingBookmarkWallet = getBookmark(addressValue);
      if (existingBookmarkWallet) {
        setErrorMessage(
          t('error.title.bookmarkAlreadyExists', {
            name: existingBookmarkWallet.name,
          }),
        );
        return;
      }

      const validationCheck = await validateAddress(addressValue);
      if (!validationCheck.isValid) {
        setErrorMessage(validationCheck.error);
      }
    }
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
            <Input
              size="small"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onChange={handleNameInputChange}
              // onBlur={handleNameInputOnBlur}
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
                onBlur={handleAddressInputOnBlur}
                value={addressValue}
                placeholder={t('sendToWallet.enterAddress')}
                aria-label={t('sendToWallet.enterAddress')}
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
            ref={bookmarkButtonRef}
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
