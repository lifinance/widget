import { AccessTimeFilled, Layers, MonetizationOn } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { formatUnits } from 'viem';
import {
  getFeeCostsBreakdown,
  getGasCostsBreakdown,
} from '../../utils/fees.js';
import { IconTypography } from './RouteCard.style.js';
import type { FeesBreakdown, RouteCardEssentialsProps } from './types.js';

export const RouteCardEssentialsExpanded: React.FC<
  RouteCardEssentialsProps
> = ({ route }) => {
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
    <Box flex={1} mt={2}>
      <Box>
        <Box display="flex" alignItems="center">
          <IconTypography ml={1} mr={3}>
            <MonetizationOn />
          </IconTypography>
          <Typography
            fontSize={16}
            color="text.primary"
            fontWeight="600"
            lineHeight={1.125}
          >
            {t(`format.currency`, {
              value: fees,
            })}
          </Typography>
        </Box>
        <Box mt={0.5} ml={7}>
          <Typography
            fontSize={12}
            color="text.secondary"
            fontWeight="500"
            lineHeight={1.125}
          >
            {t('main.fees.networkEstimated')}
          </Typography>
          {getFeeBreakdownTypography(gasCosts, t)}
          {feeCosts.length ? (
            <Box mt={0.5}>
              <Typography
                fontSize={12}
                color="text.secondary"
                fontWeight="500"
                lineHeight={1.125}
              >
                {t('main.fees.providerEstimated')}
              </Typography>
              {getFeeBreakdownTypography(feeCosts, t)}
            </Box>
          ) : null}
        </Box>
      </Box>
      <Box mt={2}>
        <Box display="flex" alignItems="center">
          <IconTypography ml={1} mr={3}>
            <Layers />
          </IconTypography>
          <Typography
            fontSize={16}
            color="text.primary"
            fontWeight="600"
            lineHeight={1.125}
          >
            {route.steps.length}
          </Typography>
        </Box>
        <Box mt={0.5} ml={7}>
          <Typography
            fontSize={12}
            color="text.secondary"
            fontWeight="500"
            lineHeight={1.125}
          >
            {t(`tooltip.numberOfSteps`)}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" mt={2}>
        <IconTypography ml={1} mr={3}>
          <AccessTimeFilled />
        </IconTypography>
        <Typography
          fontSize={16}
          color="text.primary"
          fontWeight="600"
          lineHeight={1.125}
        >
          {new Intl.NumberFormat(i18n.language, {
            style: 'unit',
            unit: 'minute',
            unitDisplay: 'long',
          }).format(executionTimeMinutes)}
        </Typography>
      </Box>
    </Box>
  );
};

const getFeeBreakdownTypography = (fees: FeesBreakdown[], t: TFunction) =>
  fees.map((fee, index) => (
    <Typography
      fontSize={12}
      fontWeight="500"
      color="text.secondary"
      key={`${fee.token.address}${index}`}
    >
      {t(`format.currency`, { value: fee.amountUSD })} (
      {parseFloat(formatUnits(fee.amount, fee.token.decimals))?.toFixed(9)}{' '}
      {fee.token.symbol})
    </Typography>
  ));
