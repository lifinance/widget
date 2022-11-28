/* eslint-disable consistent-return */
import type { Route } from '@lifi/sdk';
import { WarningRounded as WarningIcon } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import Big from 'big.js';
import type { MutableRefObject } from 'react';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { BottomSheet } from '../../components/BottomSheet';
import { useSetContentHeight } from '../../hooks';
import { IconCircle, IconContainer } from './StatusBottomSheet.style';

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
      <IconContainer>
        <IconCircle status="warning" mb={1}>
          <WarningIcon color="warning" />
        </IconCircle>
        <Typography py={1} fontSize={18} fontWeight={700}>
          {t('swap.warning.title.highValueLoss')}
        </Typography>
      </IconContainer>
      <Typography py={1}>{t('swap.warning.message.highValueLoss')}</Typography>
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Typography>{t('swap.swapping')}</Typography>
        <Typography fontWeight={600}>
          {t('format.currency', { value: route.fromAmountUSD })}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={0.25}>
        <Typography>{t('swap.gasCost')}</Typography>
        <Typography fontWeight={600}>
          {t('format.currency', { value: route.gasCostUSD })}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={0.25}>
        <Typography>{t('swap.receiving')}</Typography>
        <Typography fontWeight={600}>
          {t('format.currency', { value: route.toAmountUSD })}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={0.25}>
        <Typography>{t('swap.valueLoss')}</Typography>
        <Typography fontWeight={600}>
          {Big(route.toAmountUSD || 0)
            .div(Big(route.fromAmountUSD || 0).plus(Big(route.gasCostUSD || 0)))
            .minus(1)
            .mul(100)
            .round(2, Big.roundUp)
            .toString()}
          %
        </Typography>
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
  const fromAmountUSD = Big(route?.fromAmountUSD || 0);
  const toAmountUSD = Big(route?.toAmountUSD || 0);
  const gasCostUSD = Big(route?.gasCostUSD || 0);
  if (fromAmountUSD.eq(0) && toAmountUSD.eq(0)) {
    return false;
  }
  return toAmountUSD.div(fromAmountUSD.plus(gasCostUSD)).lt(0.9);
};
