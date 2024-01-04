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
  IconContainer,
  SheetTitle,
  SheetAddress,
} from './SendToWallet.style';
import { navigationRoutes } from '../../utils';
import { Bookmark, useBookmarksActions, useFieldActions } from '../../stores';
interface ConfirmAddressSheetProps {
  address: string;
  bookmark?: Bookmark;
}
export const ConfirmAddressSheet = forwardRef<
  BottomSheetBase,
  ConfirmAddressSheetProps
>(({ address, bookmark }, ref) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setFieldValue } = useFieldActions();
  const { setSelectBookmark } = useBookmarksActions();
  const handleCancel = () => {
    (ref as MutableRefObject<BottomSheetBase>).current?.close();
  };

  const handleConfirm = () => {
    (ref as MutableRefObject<BottomSheetBase>).current?.close();
    setFieldValue('toAddress', address);
    setSelectBookmark(bookmark);
    navigate(navigationRoutes.home);
  };

  return (
    <BottomSheet ref={ref}>
      <SendToWalletSheetContainer>
        <IconContainer>
          <WalletIcon sx={{ fontSize: 48 }} />
        </IconContainer>
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
