import AccessTimeIcon from '@mui/icons-material/AccessTimeFilled';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Box, Tooltip, Typography } from '@mui/material';
import type { TFunction } from 'i18next';
import type { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { formatUnits } from 'viem';
import { CardIconButton } from '../Card';
import { IconTypography } from './RouteCard.style';
import type { FeesBreakdown, RouteCardEssentialsProps } from './types';
import { getFeeCostsBreakdown, getGasCostsBreakdown } from './utils';

export const RouteCardEssentials: React.FC<RouteCardEssentialsProps> = ({
  route,
  dense,
  expanded,
  onClick,
}) => {
  const { t } = useTranslation();

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    onClick?.((expanded) => !expanded);
  };

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
            {t(`tooltip.estimatedNetworkFee`)}
            {getFeeBreakdownTypography(gasCosts, t)}
            {feeCosts.length ? (
              <Box mt={1}>
                {t(`tooltip.additionalProviderFee`)}
                {getFeeBreakdownTypography(feeCosts, t)}
              </Box>
            ) : null}
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
      {onClick ? (
        <CardIconButton onClick={handleExpand} size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </CardIconButton>
      ) : null}
    </Box>
  );
};

const getFeeBreakdownTypography = (fees: FeesBreakdown[], t: TFunction) =>
  fees.map((gas, index) => (
    <Typography
      fontSize={12}
      fontWeight="500"
      key={`${gas.token.address}${index}`}
    >
      {parseFloat(formatUnits(gas.amount, gas.token.decimals))?.toFixed(9)}{' '}
      {gas.token.symbol} ({t(`format.currency`, { value: gas.amountUSD })})
    </Typography>
  ));
