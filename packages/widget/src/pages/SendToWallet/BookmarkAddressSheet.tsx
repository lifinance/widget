import { Error, TurnedIn } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import type { ChangeEvent, MutableRefObject } from 'react';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomSheet } from '../../components/BottomSheet/BottomSheet.js';
import type { BottomSheetBase } from '../../components/BottomSheet/types.js';
import { Input } from '../../components/Input.js';
import { useAddressValidation } from '../../hooks/useAddressValidation.js';
import type { Bookmark } from '../../stores/bookmarks/types.js';
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js';
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
} from './SendToWalletPage.style.js';
import type { BookmarkError } from './types.js';

interface BookmarkAddressProps {
  onAddBookmark: (bookmark: Bookmark) => void;
  validatedWallet?: Bookmark;
}

export const BookmarkAddressSheet = forwardRef<
  BottomSheetBase,
  BookmarkAddressProps
>(({ validatedWallet, onAddBookmark }, ref) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<BookmarkError>();
  const { validateAddress, isValidating } = useAddressValidation();
  const { getBookmark } = useBookmarkActions();

  const nameValue = name || validatedWallet?.name || '';
  const addressValue = address || validatedWallet?.address || '';

  const handleCancel = () => {
    setError(undefined);
    (ref as MutableRefObject<BottomSheetBase>).current?.close();
  };

  const validateWithAddressFromInput = async () => {
    const validationResult = await validateAddress(address);
    if (!validationResult.isValid) {
      setError({ type: 'address', message: validationResult.error });
      return;
    }

    return {
      name: nameValue.trim(),
      address: validationResult.address,
      chainType: validationResult.chainType,
    };
  };

  const validateWithValidatedWallet = () => {
    if (error) {
      setError(undefined);
    }
    return {
      name: nameValue.trim(),
      address: validatedWallet!.address,
      chainType: validatedWallet!.chainType,
    };
  };

  const handleBookmark = async () => {
    if (isValidating) {
      return;
    }
    if (!nameValue) {
      setError({
        type: 'name',
        message: t('error.title.bookmarkNameRequired'),
      });
      return;
    }
    if (!addressValue) {
      setError({
        type: 'address',
        message: t('error.title.addressRequired'),
      });
      return;
    }

    //  If the validatedWallet is supplied as a prop then we should assume
    //  the address has already been validated
    const validatedBookmark = validatedWallet
      ? validateWithValidatedWallet()
      : await validateWithAddressFromInput();

    if (validatedBookmark) {
      const existingBookmark = getBookmark(validatedBookmark.address);
      if (existingBookmark) {
        setError({
          type: 'address',
          message: t('error.title.bookmarkAlreadyExists', {
            name: existingBookmark.name,
          }),
        });
        return;
      }

      (ref as MutableRefObject<BottomSheetBase>).current?.close();

      onAddBookmark({
        name: validatedBookmark.name,
        address: validatedBookmark.address,
        chainType: validatedBookmark.chainType,
      });
    }
  };

  const handleAddressInputChange = (e: ChangeEvent) => {
    if (error) {
      setError(undefined);
    }
    setAddress((e.target as HTMLInputElement).value.trim());
  };

  const handleNameInputChange = (e: ChangeEvent) => {
    if (error) {
      setError(undefined);
    }
    setName((e.target as HTMLInputElement).value.trim());
  };

  const resetValues = () => {
    setName('');
    setAddress('');
  };

  return (
    <BottomSheet ref={ref} onClose={resetValues}>
      <SendToWalletSheetContainer>
        <IconContainer>
          <TurnedIn sx={{ fontSize: 40 }} />
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
          <SendToWalletCard
            variant={error?.type === 'name' ? 'error' : 'default'}
          >
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
              inputProps={{ maxLength: 128 }}
            />
          </SendToWalletCard>
          {!validatedWallet && (
            <SendToWalletCard
              variant={error?.type === 'address' ? 'error' : 'default'}
            >
              <AddressInput
                size="small"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onChange={handleAddressInputChange}
                value={address}
                placeholder={t('sendToWallet.enterAddress')}
                aria-label={t('sendToWallet.enterAddress')}
                maxRows={2}
                inputProps={{ maxLength: 128 }}
                multiline
              />
            </SendToWalletCard>
          )}
          {error ? (
            <ValidationAlert icon={<Error />}>{error.message}</ValidationAlert>
          ) : null}
        </BookmarkInputFields>
        <SendToWalletButtonRow>
          <Button variant="text" onClick={handleCancel} fullWidth>
            {t('button.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleBookmark}
            fullWidth
            focusRipple
          >
            {t('button.bookmark')}
          </Button>
        </SendToWalletButtonRow>
      </SendToWalletSheetContainer>
    </BottomSheet>
  );
});
