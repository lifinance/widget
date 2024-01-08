import { ChangeEvent, forwardRef, MutableRefObject, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import ErrorIcon from '@mui/icons-material/Error';
import { BottomSheet, BottomSheetBase } from '../../components/BottomSheet';
import { AlertSection } from '../../components/AlertSection';
import { navigationRoutes } from '../../utils';
import { useBookmarksActions } from '../../stores';
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
} from './SendToWalletPage.style';
import { Button } from '@mui/material';

interface BookmarkAddressProps {
  address?: string;
}
export const BookmarkAddressSheet = forwardRef<
  BottomSheetBase,
  BookmarkAddressProps
>(({ address }, ref) => {
  const { t } = useTranslation();
  const { addBookmark } = useBookmarksActions();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [nameValue, setNameValue] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { validateAddressOrENS } = useAddressAndENSValidation();
  const handleCancel = () => {
    (ref as MutableRefObject<BottomSheetBase>).current?.close();
  };

  const handleBookmark = async () => {
    if (!nameValue) {
      setErrorMessage(t('error.title.bookmarkNameRequired'));
      return;
    }

    //  If the address is supplied as a prop then we should assume the address has already been validated
    let validAddress = !!address;
    if (!address) {
      const addressValidationCheck = await validateAddressOrENS(addressValue);
      setErrorMessage(addressValidationCheck.error);
      validAddress = addressValidationCheck.isValid;
    }

    if (nameValue && validAddress) {
      (ref as MutableRefObject<BottomSheetBase>).current?.close();

      addBookmark(nameValue.trim(), address || addressValue);

      if (!pathname.includes(navigationRoutes.bookmarkedWallets)) {
        navigate(navigationRoutes.bookmarkedWallets);
      }
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
        {address && <SheetAddress>{address}</SheetAddress>}
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
          {!address && (
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
            <AlertSection
              severity="error"
              icon={<ErrorIcon />}
              sx={{ padding: '0' }}
            >
              {errorMessage}
            </AlertSection>
          )}
        </BookmarkInputFields>
        <SendToWalletButtonRow>
          <Button
            sx={{ flexGrow: 1 }}
            color="secondary"
            variant="contained"
            onClick={handleCancel}
            disableRipple
          >
            {t('button.cancel')}
          </Button>
          <Button
            sx={{ flexGrow: 1 }}
            variant="contained"
            onClick={handleBookmark}
            disableRipple
          >
            {t('button.bookmark')}
          </Button>
        </SendToWalletButtonRow>
      </SendToWalletSheetContainer>
    </BottomSheet>
  );
});
