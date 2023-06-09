import type { Route } from '@lifi/sdk';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Box, Button, Typography } from '@mui/material';
import type { MutableRefObject } from 'react';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { BottomSheet } from '../../components/BottomSheet';
import { useSetContentHeight } from '../../hooks';
import { CenterContainer, IconCircle } from './StatusBottomSheet.style';
import { calcValueLoss } from './utils';

interface TokenValueBottomSheetProps {
  route: Route;
  onContinue(): void;
  onCancel?(): void;
}

export const TokenValueBottomSheet = forwardRef<
  BottomSheetBase,
  TokenValueBottomSheetProps
>(({ route, onContinue, onCancel }, ref) => {
  const handleCancel = () => {
    (ref as MutableRefObject<BottomSheetBase>).current?.close();
    onCancel?.();
  };

  return (
    <BottomSheet ref={ref} onClose={onCancel}>
      <TokenValueBottomSheetContent
        route={route}
        onContinue={onContinue}
        onCancel={handleCancel}
      />
    </BottomSheet>
  );
});

const TokenValueBottomSheetContent: React.FC<TokenValueBottomSheetProps> = ({
  route,
  onCancel,
  onContinue,
}) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>();
  useSetContentHeight(ref);
  return (
    <Box p={3} ref={ref}>
      <CenterContainer>
        <IconCircle status="warning" mb={1}>
          <WarningRoundedIcon color="warning" />
        </IconCircle>
        <Typography py={1} fontSize={18} fontWeight={700}>
          {t('warning.title.highValueLoss')}
        </Typography>
      </CenterContainer>
      <Typography py={1}>{t('warning.message.highValueLoss')}</Typography>
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Typography>{t('main.sending')}</Typography>
        <Typography fontWeight={600}>
          {t('format.currency', { value: route.fromAmountUSD })}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={0.25}>
        <Typography>{t('main.gasCost')}</Typography>
        <Typography fontWeight={600}>
          {t('format.currency', { value: route.gasCostUSD })}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={0.25}>
        <Typography>{t('main.receiving')}</Typography>
        <Typography fontWeight={600}>
          {t('format.currency', { value: route.toAmountUSD })}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={0.25}>
        <Typography>{t('main.valueLoss')}</Typography>
        <Typography fontWeight={600}>{calcValueLoss(route)}</Typography>
      </Box>
      <Box display="flex" mt={3}>
        <Button variant="text" onClick={onCancel} fullWidth>
          {t('button.cancel')}
        </Button>
        <Box display="flex" p={1} />
        <Button variant="contained" onClick={onContinue} fullWidth>
          {t('button.continue')}
        </Button>
      </Box>
    </Box>
  );
};

export const getTokenValueLossThreshold = (route?: Route) => {
  if (!route) {
    return false;
  }
  const fromAmountUSD = Number(route.fromAmountUSD || 0);
  const toAmountUSD = Number(route.toAmountUSD || 0);
  const gasCostUSD = Number(route.gasCostUSD || 0);
  if (!fromAmountUSD && !toAmountUSD) {
    return false;
  }
  return toAmountUSD / (fromAmountUSD + gasCostUSD) < 0.9;
};
