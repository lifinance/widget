import ErrorIcon from '@mui/icons-material/Error';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { Button, Typography } from '@mui/material';
import type { ChangeEvent, FocusEventHandler, MutableRefObject } from 'react';
import { forwardRef, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { BottomSheet } from '../../components/BottomSheet';
import { Input } from '../../components/Input';
import { useAddressValidation } from '../../hooks';
import type { Bookmark } from '../../stores';
import { useBookmarkActions } from '../../stores';
import {
  AddressInput,
  BookmarkInputFields,
  IconContainer,
  SendToWalletButtonRow,
  SendToWalletCard,
  SendToWalletSheetContainer,
  SheetAddressContainer,
  SheetTitle,
  ValidationAlert,
} from './SendToWalletPage.style';

interface BookmarkAddressProps {
  onAddBookmark: (bookmark: Bookmark) => void;
  validatedWallet?: Bookmark;
}

export const BookmarkAddressSheet = forwardRef<
  BottomSheetBase,
  BookmarkAddressProps
>(({ validatedWallet, onAddBookmark }, ref) => {
  const { t } = useTranslation();
  const bookmarkButtonRef = useRef<HTMLButtonElement>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { validateAddress, isValidating } = useAddressValidation();
  const { getBookmark } = useBookmarkActions();

  const nameValue = name || validatedWallet?.name || '';
  const addressValue = address || validatedWallet?.address || '';

  const handleCancel = () => {
    setErrorMessage('');
    (ref as MutableRefObject<BottomSheetBase>).current?.close();
  };

  const validateWithAddressFromInput = async () => {
    const validationResult = await validateAddress(address);
    if (!validationResult.isValid) {
      setErrorMessage(validationResult.error);
      return;
    }

    return {
      name: nameValue.trim(),
      address: validationResult.address,
      chainType: validationResult.chainType,
    };
  };

  const validateWithValidatedWallet = () => {
    if (errorMessage) {
      setErrorMessage('');
    }
    return {
      name: nameValue.trim(),
      address: validatedWallet!.address,
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

    const existingBookmark = getBookmark(addressValue);
    if (existingBookmark) {
      setErrorMessage(
        t('error.title.bookmarkAlreadyExists', {
          name: existingBookmark.name,
        }),
      );
      return;
    }

    //  If the validatedWallet is supplied as a prop then we should assume
    //  the address has already been validated
    const validatedBookmark = validatedWallet
      ? validateWithValidatedWallet()
      : await validateWithAddressFromInput();

    if (validatedBookmark) {
      (ref as MutableRefObject<BottomSheetBase>).current?.close();

      onAddBookmark({
        name: validatedBookmark.name,
        address: validatedBookmark.address,
        chainType: validatedBookmark.chainType,
      });
    }
  };

  const handleAddressInputChange = (e: ChangeEvent) => {
    setAddress((e.target as HTMLInputElement).value.trim());
  };

  const handleNameInputChange = (e: ChangeEvent) => {
    setName((e.target as HTMLInputElement).value.trim());
  };

  const resetValues = () => {
    setName('');
    setAddress('');
  };

  const handleAddressInputOnBlur: FocusEventHandler = async (e) => {
    if (!(e.relatedTarget === bookmarkButtonRef.current) && !isValidating) {
      if (!address) {
        return;
      }

      const existingBookmark = getBookmark(address);
      if (existingBookmark) {
        setErrorMessage(
          t('error.title.bookmarkAlreadyExists', {
            name: existingBookmark.name,
          }),
        );
        return;
      }

      const validationResult = await validateAddress(address);
      if (!validationResult.isValid) {
        setErrorMessage(validationResult.error);
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
        {validatedWallet ? (
          <SheetAddressContainer>
            {validatedWallet?.name ? (
              <Typography fontWeight={600} mb={0.5}>
                {validatedWallet?.name}
              </Typography>
            ) : null}
            <Typography>{validatedWallet?.address}</Typography>
          </SheetAddressContainer>
        ) : null}
        <BookmarkInputFields>
          <SendToWalletCard>
            <Input
              size="small"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onChange={handleNameInputChange}
              value={name}
              placeholder={validatedWallet?.name || t('sendToWallet.enterName')}
              aria-label={validatedWallet?.name || t('sendToWallet.enterName')}
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
                value={address}
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
