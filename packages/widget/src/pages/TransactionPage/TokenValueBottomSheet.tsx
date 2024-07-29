import type { Route } from '@lifi/sdk';
import { WarningRounded } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import type { MutableRefObject } from 'react';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomSheet } from '../../components/BottomSheet/BottomSheet.js';
import type { BottomSheetBase } from '../../components/BottomSheet/types.js';
import { FeeBreakdownTooltip } from '../../components/FeeBreakdownTooltip.js';
import { useSetContentHeight } from '../../hooks/useContentHeight.js';
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js';
import { CenterContainer, IconCircle } from './StatusBottomSheet.style.js';
import { calculateValueLossPercentage } from './utils.js';

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
  const { gasCosts, feeCosts, gasCostUSD, feeCostUSD } =
    getAccumulatedFeeCostsBreakdown(route);
  const fromAmountUSD = parseFloat(route.fromAmountUSD);
  const toAmountUSD = parseFloat(route.toAmountUSD);
  return (
    <Box p={3} ref={ref}>
      <CenterContainer>
        <IconCircle status="warning" mb={1}>
          <WarningRounded color="warning" />
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
        <Typography>{t('main.fees.network')}</Typography>
        <FeeBreakdownTooltip gasCosts={gasCosts}>
          <Typography fontWeight={600}>
            {t('format.currency', { value: gasCostUSD })}
          </Typography>
        </FeeBreakdownTooltip>
      </Box>
      {feeCostUSD ? (
        <Box display="flex" justifyContent="space-between" mt={0.25}>
          <Typography>{t('main.fees.provider')}</Typography>
          <FeeBreakdownTooltip feeCosts={feeCosts}>
            <Typography fontWeight={600}>
              {t('format.currency', { value: feeCostUSD })}
            </Typography>
          </FeeBreakdownTooltip>
        </Box>
      ) : null}
      <Box display="flex" justifyContent="space-between" mt={0.25}>
        <Typography>{t('main.receiving')}</Typography>
        <Typography fontWeight={600}>
          {t('format.currency', { value: route.toAmountUSD })}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={0.25}>
        <Typography>{t('main.valueLoss')}</Typography>
        <Typography fontWeight={600}>
          {calculateValueLossPercentage(
            fromAmountUSD,
            toAmountUSD,
            gasCostUSD,
            feeCostUSD,
          )}
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
