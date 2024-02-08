import { AccessTimeFilled, MonetizationOn } from '@mui/icons-material';
import { Box, Tooltip, Typography } from '@mui/material';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { formatUnits } from 'viem';
import {
  getFeeCostsBreakdown,
  getGasCostsBreakdown,
} from '../../utils/fees.js';
import { IconTypography } from './RouteCard.style.js';
import type { FeesBreakdown, RouteCardEssentialsProps } from './types.js';

export const RouteCardEssentials: React.FC<RouteCardEssentialsProps> = ({
  route,
}) => {
  const { t, i18n } = useTranslation();
  const executionTimeMinutes = Math.ceil(
    route.steps
      .map((step) => step.estimate.executionDuration)
      .reduce((duration, x) => duration + x, 0) / 60,
  );
  const gasCostUSD = parseFloat(route.gasCostUSD ?? '') || 0.01;
  const gasCosts = getGasCostsBreakdown(route);
  const feeCosts = getFeeCostsBreakdown(route, false);
  const fees =
    gasCostUSD + feeCosts.reduce((sum, feeCost) => sum + feeCost.amountUSD, 0);
  return (
    <Box display="flex" justifyContent={'space-between'} flex={1} mt={2}>
      <Tooltip
        title={
          <Box component="span">
            {t('main.fees.networkEstimated')}
            {getFeeBreakdownTypography(gasCosts, t)}
            {feeCosts.length ? (
              <Box mt={1}>
                {t('main.fees.providerEstimated')}
                {getFeeBreakdownTypography(feeCosts, t)}
              </Box>
            ) : null}
          </Box>
        }
        placement="top"
        enterDelay={400}
        arrow
      >
        <Box display="flex" alignItems="center">
          <IconTypography mr={0.5}>
            <MonetizationOn fontSize="small" />
          </IconTypography>
          <Typography
            fontSize={14}
            color="text.primary"
            fontWeight="500"
            lineHeight={1}
          >
            {t(`format.currency`, {
              value: fees,
            })}
          </Typography>
        </Box>
      </Tooltip>
      <Tooltip
        title={t(`tooltip.estimatedTime`)}
        placement="top"
        enterDelay={400}
        arrow
      >
        <Box display="flex" alignItems="center">
          <IconTypography mr={0.5}>
            <AccessTimeFilled fontSize="small" />
          </IconTypography>
          <Typography
            fontSize={14}
            color="text.primary"
            fontWeight="500"
            lineHeight={1}
          >
            {new Intl.NumberFormat(i18n.language, {
              style: 'unit',
              unit: 'minute',
              unitDisplay: 'narrow',
            }).format(executionTimeMinutes)}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

const getFeeBreakdownTypography = (fees: FeesBreakdown[], t: TFunction) =>
  fees.map((fee, index) => (
    <Typography
      fontSize={12}
      fontWeight="500"
      key={`${fee.token.address}${index}`}
    >
      {t(`format.currency`, { value: fee.amountUSD })} (
      {parseFloat(formatUnits(fee.amount, fee.token.decimals))?.toFixed(9)}{' '}
      {fee.token.symbol})
    </Typography>
  ));
