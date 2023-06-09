import AccessTimeIcon from '@mui/icons-material/AccessTimeFilled';
import EvStationIcon from '@mui/icons-material/EvStation';
import LayersIcon from '@mui/icons-material/Layers';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Box, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IconTypography } from './RouteCard.style';
import type { RouteCardEssentialsProps } from './types';
import { getFeeCostsBreakdown, getGasCostsBreakdown } from './utils';

export const RouteCardEssentials: React.FC<RouteCardEssentialsProps> = ({
  route,
  dense,
}) => {
  const { t } = useTranslation();
  const executionTimeMinutes = Math.ceil(
    route.steps
      .map((step) => step.estimate.executionDuration)
      .reduce((duration, x) => duration + x, 0) / 60,
  );
  const gasCostUSD = parseFloat(route.gasCostUSD ?? '') || 0.01;
  const gasCosts = getGasCostsBreakdown(route);
  const feeCosts = getFeeCostsBreakdown(route, false);
  return (
    <Box display="flex" justifyContent={'space-between'} flex={1} mt={2}>
      <Tooltip
        title={
          <Box component="span">
            {t(`tooltip.estimatedNetworkFee`)}
            {gasCosts.map((gas, index) => (
              <Typography
                fontSize={12}
                fontWeight="500"
                key={`${gas.token.address}${index}`}
              >
                {gas.amount?.toFixed(9)} {gas.token.symbol} (
                {t(`format.currency`, { value: gas.amountUSD })})
              </Typography>
            ))}
          </Box>
        }
        placement="top"
        enterDelay={400}
        arrow
      >
        <Box display="flex" alignItems="center" mr={dense ? 0 : 2}>
          <IconTypography>
            <EvStationIcon fontSize="small" />
          </IconTypography>
          <Typography
            fontSize={14}
            color="text.primary"
            fontWeight="500"
            lineHeight={1}
          >
            {t(`format.currency`, { value: gasCostUSD })}
          </Typography>
        </Box>
      </Tooltip>
      <Tooltip
        title={
          <Box component="span">
            {t(`tooltip.additionalProviderFee`)}
            {feeCosts.map((fee, index) => (
              <Typography
                fontSize={12}
                fontWeight="500"
                key={`${fee.token.address}${index}`}
              >
                {fee.amount?.toFixed(9)} {fee.token.symbol} (
                {t(`format.currency`, { value: fee.amountUSD })})
              </Typography>
            ))}
          </Box>
        }
        placement="top"
        enterDelay={400}
        arrow
      >
        <Box display="flex" alignItems="center" mr={dense ? 0 : 2}>
          <IconTypography>
            <MonetizationOnIcon fontSize="small" />
          </IconTypography>
          <Typography
            fontSize={14}
            color="text.primary"
            fontWeight="500"
            lineHeight={1}
          >
            {t(`format.currency`, {
              value: feeCosts.reduce(
                (sum, feeCost) => sum + feeCost.amountUSD,
                0,
              ),
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
        <Box display="flex" alignItems="center" mr={dense ? 0 : 2}>
          <IconTypography>
            <AccessTimeIcon fontSize="small" />
          </IconTypography>
          <Typography
            fontSize={14}
            color="text.primary"
            fontWeight="500"
            lineHeight={1}
          >
            {t('main.estimatedTime', {
              value: executionTimeMinutes,
            })}
          </Typography>
        </Box>
      </Tooltip>
      <Tooltip
        title={t(`tooltip.numberOfSteps`)}
        placement="top"
        enterDelay={400}
        arrow
      >
        <Box display="flex" alignItems="center">
          <IconTypography>
            <LayersIcon fontSize="small" />
          </IconTypography>
          <Typography
            fontSize={14}
            color="text.primary"
            fontWeight="500"
            lineHeight={1}
          >
            {route.steps.length}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};
