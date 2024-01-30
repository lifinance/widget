import InfoIcon from '@mui/icons-material/Info';
import WalletIcon from '@mui/icons-material/Wallet';
import { Button, Typography } from '@mui/material';
import type { MutableRefObject } from 'react';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AlertMessage } from '../../components/AlertMessage';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { BottomSheet } from '../../components/BottomSheet';
import type { Bookmark } from '../../stores';
import { useFieldActions, useSendToWalletStore } from '../../stores';
import { navigationRoutes } from '../../utils';
import {
  IconContainer,
  SendToWalletButtonRow,
  SendToWalletSheetContainer,
  SheetAddressContainer,
  SheetTitle,
} from './SendToWalletPage.style';

interface ConfirmAddressSheetProps {
  onConfirm: (wallet: Bookmark) => void;
  validatedBookmark?: Bookmark;
}

export const ConfirmAddressSheet = forwardRef<
  BottomSheetBase,
  ConfirmAddressSheetProps
>(({ validatedBookmark, onConfirm }, ref) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setFieldValue } = useFieldActions();
  const setSendToWallet = useSendToWalletStore(
    (state) => state.setSendToWallet,
  );

  const handleClose = () => {
    (ref as MutableRefObject<BottomSheetBase>).current?.close();
  };

  const handleConfirm = () => {
    if (validatedBookmark) {
      setFieldValue('toAddress', validatedBookmark.address, {
        isTouched: true,
      });
      onConfirm?.(validatedBookmark);
      setSendToWallet(true);
      handleClose();
      navigate(navigationRoutes.home);
    }
  };

  return (
    <BottomSheet ref={ref}>
      <SendToWalletSheetContainer>
        <IconContainer>
          <WalletIcon sx={{ fontSize: 40 }} />
        </IconContainer>
        <SheetTitle>{t('sendToWallet.confirmWalletAddress')}</SheetTitle>
        <SheetAddressContainer>
          {validatedBookmark?.name ? (
            <Typography fontWeight={600} mb={0.5}>
              {validatedBookmark?.name}
            </Typography>
          ) : null}
          <Typography>{validatedBookmark?.address}</Typography>
        </SheetAddressContainer>
        <AlertMessage
          title={
            <Typography variant="body2">
              {t('info.message.fundsToExchange')}
            </Typography>
          }
          icon={<InfoIcon />}
        />
        <SendToWalletButtonRow>
          <Button variant="text" onClick={handleClose} fullWidth>
            {t('button.cancel')}
          </Button>
          <Button variant="contained" onClick={handleConfirm} fullWidth>
            {t('button.confirm')}
          </Button>
        </SendToWalletButtonRow>
      </SendToWalletSheetContainer>
    </BottomSheet>
  );
});
