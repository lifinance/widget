import { AccessTimeFilled, LocalGasStationRounded } from '@mui/icons-material';
import { Box, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getFeeCostsBreakdown } from '../../utils/fees.js';
import { FeeBreakdownTooltip } from '../FeeBreakdownTooltip.js';
import { IconTypography } from '../IconTypography.js';
import { TokenRate } from '../TokenRate.js';
import type { RouteCardEssentialsProps } from './types.js';

export const RouteCardEssentials: React.FC<RouteCardEssentialsProps> = ({
  route,
}) => {
  const { t, i18n } = useTranslation();
  const executionTimeMinutes = Math.ceil(
    route.steps
      .map((step) => step.estimate.executionDuration)
      .reduce((duration, x) => duration + x, 0) / 60,
  );
  const gasCostUSD = parseFloat(route.gasCostUSD || '0');
  const feeCosts = getFeeCostsBreakdown(route, false);
  const fees =
    gasCostUSD + feeCosts.reduce((sum, feeCost) => sum + feeCost.amountUSD, 0);
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent={'space-between'}
      flex={1}
      mt={2}
    >
      <TokenRate route={route} />
      <Box display="flex" alignItems="center">
        <FeeBreakdownTooltip route={route} feeCosts={feeCosts}>
          <Box display="flex" mr={1.5} alignItems="center">
            <IconTypography mr={0.5} fontSize={16}>
              <LocalGasStationRounded fontSize="inherit" />
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
        </FeeBreakdownTooltip>
        <Tooltip title={t(`tooltip.estimatedTime`)} sx={{ cursor: 'help' }}>
          <Box display="flex" alignItems="center">
            <IconTypography mr={0.5} fontSize={16}>
              <AccessTimeFilled fontSize="inherit" />
            </IconTypography>
            <Typography
              fontSize={14}
              color="text.primary"
              fontWeight="500"
              lineHeight={1}
            >
              {executionTimeMinutes.toLocaleString(i18n.language, {
                style: 'unit',
                unit: 'minute',
                unitDisplay: 'narrow',
              })}
            </Typography>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};
