import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@mui/icons-material/Info';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { BottomSheet } from '../../components/BottomSheet';
import { forwardRef, MutableRefObject } from 'react';
import { AlertSection } from '../../components/AlertSection';
import WalletIcon from '@mui/icons-material/Wallet';
import {
  SendToWalletSheetButton,
  SendToWalletButtonRow,
  SendToWalletSheetContainer,
  SheetIconContainer,
  SheetTitle,
  SheetAddress,
} from './SendToWalletPage.style';
import { navigationRoutes } from '../../utils';
import { useFieldActions } from '../../stores';
interface ConfirmAddressSheetProps {
  address: string;
}
export const ConfirmAddressSheet = forwardRef<
  BottomSheetBase,
  ConfirmAddressSheetProps
>(({ address }, ref) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setFieldValue } = useFieldActions();
  const handleCancel = () => {
    (ref as MutableRefObject<BottomSheetBase>).current?.close();
  };

  const handleConfirm = () => {
    setFieldValue('toAddress', address);
    navigate(navigationRoutes.home);
  };

  return (
    <BottomSheet ref={ref}>
      <SendToWalletSheetContainer>
        <SheetIconContainer>
          <WalletIcon sx={{ fontSize: 48 }} />
        </SheetIconContainer>
        <SheetTitle>{t('sendToWallet.confirmWalletAddress')}</SheetTitle>
        <SheetAddress>{address}</SheetAddress>
        <AlertSection severity="info" icon={<InfoIcon />}>
          {t('info.message.fundsToExchange')}
        </AlertSection>
        <SendToWalletButtonRow>
          <SendToWalletSheetButton
            color="secondary"
            variant="contained"
            onClick={handleCancel}
            disableRipple
          >
            {t('button.cancel')}
          </SendToWalletSheetButton>
          <SendToWalletSheetButton
            variant="contained"
            onClick={handleConfirm}
            disableRipple
          >
            {t('button.confirm')}
          </SendToWalletSheetButton>
        </SendToWalletButtonRow>
      </SendToWalletSheetContainer>
    </BottomSheet>
  );
});
