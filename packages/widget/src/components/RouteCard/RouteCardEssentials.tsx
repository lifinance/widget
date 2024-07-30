import { AccessTimeFilled, LocalGasStationRounded } from '@mui/icons-material';
import { Box, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js';
import { FeeBreakdownTooltip } from '../FeeBreakdownTooltip.js';
import { IconTypography } from '../IconTypography.js';
import { TokenRate } from '../TokenRate/TokenRate.js';
import type { RouteCardEssentialsProps } from './types.js';

export const RouteCardEssentials: React.FC<RouteCardEssentialsProps> = ({
  route,
}) => {
  const { t, i18n } = useTranslation();
  const executionTimeSeconds = Math.floor(
    route.steps.reduce(
      (duration, step) => duration + step.estimate.executionDuration,
      0,
    ),
  );
  const executionTimeMinutes = Math.floor(executionTimeSeconds / 60);
  const { gasCosts, feeCosts, combinedFeesUSD } =
    getAccumulatedFeeCostsBreakdown(route);
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
        <FeeBreakdownTooltip gasCosts={gasCosts} feeCosts={feeCosts}>
          <Box display="flex" mr={1.5} alignItems="center">
            <IconTypography mr={0.5} fontSize={16}>
              <LocalGasStationRounded fontSize="inherit" />
            </IconTypography>
            <Typography
              fontSize={14}
              color="text.primary"
              fontWeight={600}
              lineHeight={1}
              data-value={combinedFeesUSD}
            >
              {t(`format.currency`, {
                value: combinedFeesUSD,
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
              fontWeight={600}
              lineHeight={1}
            >
              {(executionTimeSeconds < 60
                ? executionTimeSeconds
                : executionTimeMinutes
              ).toLocaleString(i18n.language, {
                style: 'unit',
                unit: executionTimeSeconds < 60 ? 'second' : 'minute',
                unitDisplay: 'narrow',
              })}
            </Typography>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};
