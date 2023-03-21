import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EvStationOutlinedIcon from '@mui/icons-material/EvStationOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import { Box, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { SwapRouteCardEssentialsProps } from './types';
import { getFeeCostsBreakdown, getGasCostsBreakdown } from './utils';

export const SwapRouteCardEssentials: React.FC<
  SwapRouteCardEssentialsProps
> = ({ route, dense }) => {
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
            {gasCosts.map((gas) => (
              <Typography
                fontSize={11}
                key={`${gas.token.address}${gas.token.symbol}`}
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
          <Typography lineHeight={0} mr={0.5} color="grey.500">
            <EvStationOutlinedIcon fontSize={dense ? 'small' : 'medium'} />
          </Typography>
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
            {feeCosts.map((fee) => (
              <Typography
                fontSize={11}
                key={`${fee.token.address}${fee.token.symbol}`}
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
          <Typography lineHeight={0} mr={0.5} color="grey.500">
            <MonetizationOnOutlinedIcon fontSize={dense ? 'small' : 'medium'} />
          </Typography>
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
          <Typography lineHeight={0} mr={0.5} color="grey.500">
            <AccessTimeIcon fontSize={dense ? 'small' : 'medium'} />
          </Typography>
          <Typography
            fontSize={14}
            color="text.primary"
            fontWeight="500"
            lineHeight={1}
          >
            {t('swap.estimatedTime', {
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
          <Typography lineHeight={0} mr={0.5} color="grey.500">
            <LayersOutlinedIcon fontSize={dense ? 'small' : 'medium'} />
          </Typography>
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
