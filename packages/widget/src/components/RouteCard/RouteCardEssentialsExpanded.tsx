import AccessTimeIcon from '@mui/icons-material/AccessTimeFilled';
import LayersIcon from '@mui/icons-material/Layers';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Box, Typography } from '@mui/material';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { formatUnits } from 'viem';
import { getFeeCostsBreakdown, getGasCostsBreakdown } from '../../utils';
import { IconTypography } from './RouteCard.style';
import type { FeesBreakdown, RouteCardEssentialsProps } from './types';
import { useWidgetConfig } from '../../providers';

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
            <MonetizationOnIcon />
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
            <LayersIcon />
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

      <Box mt={2}>
        <Box display="flex" alignItems="center">
          <IconTypography ml={1} mr={3}>
            <BarChartIcon />
          </IconTypography>
          <Typography
            fontSize={16}
            color="text.primary"
            fontWeight="600"
            lineHeight={1.125}
          >
            $231
          </Typography>
        </Box>
        <Box mt={0.5} ml={7}>
          <Typography
            fontSize={12}
            color="text.secondary"
            fontWeight="500"
            lineHeight={1.125}
          >
            Your Profit and Loss receive:
          </Typography>
          <Typography
            fontSize={12}
            color="text.secondary"
            fontWeight="500"
            lineHeight={1.125}
          >
            $231 gain 10%
          </Typography>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" mt={2}>
        <IconTypography ml={1} mr={3}>
          <AccessTimeIcon />
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

      <Box display="flex" alignItems="center" mt={2} gap={3.2}>
        <div style={{ marginLeft: 12, fontSize: 18 }}>🔶</div>
        <Typography
          fontSize={16}
          color="#e3a008"
          fontWeight="600"
          lineHeight={1.125}
        >
          {useWidgetConfig().gmPoints} GM Points
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
