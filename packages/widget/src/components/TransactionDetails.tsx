import type { RouteExtended } from '@lifi/sdk';
import {
  ExpandLess,
  ExpandMore,
  LocalGasStationRounded,
} from '@mui/icons-material';
import type { CardProps } from '@mui/material';
import { Box, Collapse, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isRouteDone } from '../stores/routes/utils.js';
import { getFeeCostsBreakdown, getGasCostsBreakdown } from '../utils/fees.js';
import {
  convertToSubscriptFormat,
  formatTokenAmount,
  formatTokenPrice,
} from '../utils/format.js';
import { Card } from './Card/Card.js';
import { CardIconButton } from './Card/CardIconButton.js';
import { FeeBreakdownTooltip } from './FeeBreakdownTooltip.js';
import { IconTypography } from './IconTypography.js';
import { TokenRate } from './TokenRate.js';

interface TransactionDetailsProps extends CardProps {
  route: RouteExtended;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  route,
  ...props
}) => {
  const { t } = useTranslation();
  const [cardExpanded, setCardExpanded] = useState(false);

  const toggleCard = () => {
    setCardExpanded((cardExpanded) => !cardExpanded);
  };

  const gasCosts = getGasCostsBreakdown(route);
  const feeCosts = getFeeCostsBreakdown(route, false);
  const gasCostUSD = gasCosts.reduce(
    (sum, gasCost) => sum + gasCost.amountUSD,
    0,
  );
  const feeCostUSD = feeCosts.reduce(
    (sum, feeCost) => sum + feeCost.amountUSD,
    0,
  );
  const fees = gasCostUSD + feeCostUSD;

  const fromTokenAmount = formatTokenAmount(
    BigInt(route.fromAmount),
    route.fromToken.decimals,
  );
  const fromTokenPrice = formatTokenPrice(
    fromTokenAmount,
    route.fromToken.priceUSD,
  );
  const toTokenAmount = formatTokenAmount(
    BigInt(route.toAmount),
    route.toToken.decimals,
  );
  const toTokenPrice =
    formatTokenPrice(toTokenAmount, route.toToken.priceUSD) || 0.01;

  const impact = (toTokenPrice / fromTokenPrice - 1) * 100;

  const priceImpact = convertToSubscriptFormat(impact, {
    notation: 'standard',
    roundingPriority: 'morePrecision',
    maximumSignificantDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
    roundingMode: 'trunc',
  });

  return (
    <Card selectionColor="secondary" {...props}>
      <Box display="flex" alignItems="center" px={2} py={1.75}>
        <Box display="flex" flex={1} alignItems="center" justifyContent="left">
          <TokenRate route={route} />
        </Box>
        <FeeBreakdownTooltip
          route={route}
          gasCosts={gasCosts}
          feeCosts={feeCosts}
        >
          <Box
            display="flex"
            alignItems="center"
            onClick={toggleCard}
            role="button"
            sx={{ cursor: 'pointer' }}
            px={1}
          >
            <IconTypography mr={0.5} fontSize={16}>
              <LocalGasStationRounded fontSize="inherit" />
            </IconTypography>
            <Typography
              fontSize={14}
              color="text.primary"
              fontWeight="600"
              lineHeight={1.429}
            >
              {t(`format.currency`, { value: fees })}
            </Typography>
          </Box>
        </FeeBreakdownTooltip>
        <CardIconButton onClick={toggleCard} size="small">
          {cardExpanded ? (
            <ExpandLess fontSize="inherit" />
          ) : (
            <ExpandMore fontSize="inherit" />
          )}
        </CardIconButton>
      </Box>
      <Collapse timeout={225} in={cardExpanded} mountOnEnter>
        <Box px={2} pb={2}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2">{t('main.fees.network')}</Typography>
            <FeeBreakdownTooltip route={route} feeCosts={[]}>
              <Typography variant="body2">
                {t(`format.currency`, {
                  value: gasCostUSD,
                })}
              </Typography>
            </FeeBreakdownTooltip>
          </Box>
          {feeCosts.length ? (
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2">{t('main.fees.provider')}</Typography>
              <FeeBreakdownTooltip
                route={route}
                gasCosts={[]}
                feeCosts={feeCosts}
              >
                <Typography variant="body2">
                  {t(`format.currency`, {
                    value: feeCostUSD,
                  })}
                </Typography>
              </FeeBreakdownTooltip>
            </Box>
          ) : null}
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2">{t('main.priceImpact')}</Typography>
            <Tooltip title={t('tooltip.priceImpact')} sx={{ cursor: 'help' }}>
              <Typography variant="body2">{priceImpact}%</Typography>
            </Tooltip>
          </Box>
          {!isRouteDone(route) ? (
            <>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2">{t('main.maxSlippage')}</Typography>
                <Typography variant="body2">
                  {route.steps[0].action.slippage * 100}%
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">{t('main.minReceived')}</Typography>
                <Tooltip
                  title={t('tooltip.minReceived')}
                  sx={{ cursor: 'help' }}
                >
                  <Typography variant="body2">
                    {t('format.number', {
                      value: formatTokenAmount(
                        BigInt(route.toAmountMin),
                        route.toToken.decimals,
                      ),
                    })}{' '}
                    {route.toToken.symbol}
                  </Typography>
                </Tooltip>
              </Box>
            </>
          ) : null}
        </Box>
      </Collapse>
    </Card>
  );
};
