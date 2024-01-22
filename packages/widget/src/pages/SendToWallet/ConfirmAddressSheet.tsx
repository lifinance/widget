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
  SheetAddress,
  SheetTitle,
} from './SendToWalletPage.style';

interface ConfirmAddressSheetProps {
  onConfirm: (wallet: Bookmark) => void;
  validatedWallet?: Bookmark;
}

export const ConfirmAddressSheet = forwardRef<
  BottomSheetBase,
  ConfirmAddressSheetProps
>(({ validatedWallet, onConfirm }, ref) => {
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
    if (validatedWallet) {
      setFieldValue('toAddress', validatedWallet.address);
      onConfirm?.(validatedWallet);
      setSendToWallet(true);
      handleClose();
      navigate(navigationRoutes.home);
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
        <AlertMessage
          title={
            <Typography variant="body2">
              {t('info.message.fundsToExchange')}
            </Typography>
          }
          icon={<InfoIcon />}
        />
        <SendToWalletButtonRow>
          <Button sx={{ flexGrow: 1 }} variant="text" onClick={handleClose}>
            {t('button.cancel')}
          </Button>
          <Button
            sx={{ flexGrow: 1 }}
            variant="contained"
            onClick={handleConfirm}
          >
            {t('button.confirm')}
          </Button>
        </SendToWalletButtonRow>
      </SendToWalletSheetContainer>
    </BottomSheet>
  );
});
