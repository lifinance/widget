import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@mui/icons-material/Info';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { BottomSheet } from '../../components/BottomSheet';
import type { MutableRefObject } from 'react';
import { forwardRef } from 'react';
import { AlertSection } from '../../components/AlertSection';
import WalletIcon from '@mui/icons-material/Wallet';
import {
  SendToWalletButtonRow,
  SendToWalletSheetContainer,
  IconContainer,
  SheetTitle,
  SheetAddress,
} from './SendToWalletPage.style';
import { navigationRoutes } from '../../utils';
import type { BookmarkedWallet } from '../../stores';
import { useFieldActions } from '../../stores';
import { Button } from '@mui/material';
interface ConfirmAddressSheetProps {
  onConfirm: (wallet: BookmarkedWallet) => void;
  validatedWallet?: BookmarkedWallet;
}
export const ConfirmAddressSheet = forwardRef<
  BottomSheetBase,
  ConfirmAddressSheetProps
>(({ validatedWallet, onConfirm }, ref) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setFieldValue } = useFieldActions();
  const handleCancel = () => {
    (ref as MutableRefObject<BottomSheetBase>).current?.close();
  };

  const handleConfirm = () => {
    if (validatedWallet) {
      (ref as MutableRefObject<BottomSheetBase>).current?.close();
      setFieldValue('toAddress', validatedWallet.address);
      navigate(navigationRoutes.home);
      onConfirm && onConfirm(validatedWallet);
    }
  };

  return (
    <BottomSheet ref={ref}>
      <SendToWalletSheetContainer>
        <IconContainer>
          <WalletIcon sx={{ fontSize: 48 }} />
        </IconContainer>
        <SheetTitle>{t('sendToWallet.confirmWalletAddress')}</SheetTitle>
        <SheetAddress>{validatedWallet?.address}</SheetAddress>
        <AlertSection severity="info" icon={<InfoIcon />}>
          {t('info.message.fundsToExchange')}
        </AlertSection>
        <SendToWalletButtonRow>
          <Button
            sx={{ flexGrow: 1 }}
            variant="text"
            onClick={handleCancel}
            disableRipple
          >
            {t('button.cancel')}
          </Button>
          <Button
            sx={{ flexGrow: 1 }}
            variant="contained"
            onClick={handleConfirm}
            disableRipple
          >
            {t('button.confirm')}
          </Button>
        </SendToWalletButtonRow>
      </SendToWalletSheetContainer>
    </BottomSheet>
  );
});
