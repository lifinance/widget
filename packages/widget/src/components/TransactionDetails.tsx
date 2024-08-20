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
import { formatUnits } from 'viem';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import { isRouteDone } from '../stores/routes/utils.js';
import { getAccumulatedFeeCostsBreakdown } from '../utils/fees.js';
import { formatTokenAmount, formatTokenPrice } from '../utils/format.js';
import { Card } from './Card/Card.js';
import { CardIconButton } from './Card/CardIconButton.js';
import { FeeBreakdownTooltip } from './FeeBreakdownTooltip.js';
import { IconTypography } from './IconTypography.js';
import { TokenRate } from './TokenRate/TokenRate.js';

interface TransactionDetailsProps extends CardProps {
  route: RouteExtended;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  route,
  ...props
}) => {
  const { t } = useTranslation();
  const { feeConfig } = useWidgetConfig();
  const [cardExpanded, setCardExpanded] = useState(false);

  const toggleCard = () => {
    setCardExpanded((cardExpanded) => !cardExpanded);
  };
  const { gasCosts, feeCosts, gasCostUSD, feeCostUSD, combinedFeesUSD } =
    getAccumulatedFeeCostsBreakdown(route);

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

  const priceImpact = toTokenPrice / fromTokenPrice - 1;

  const feeCollectionStep = route.steps[0].includedSteps.find(
    (includedStep) => includedStep.tool === 'feeCollection',
  );

  let feeAmountUSD: number = 0;

  if (feeCollectionStep) {
    const estimatedFromAmount =
      BigInt(feeCollectionStep.estimate.fromAmount) -
      BigInt(feeCollectionStep.estimate.toAmount);

    const feeAmount = formatUnits(
      estimatedFromAmount,
      feeCollectionStep.action.fromToken.decimals,
    );

    feeAmountUSD =
      parseFloat(feeAmount) *
      parseFloat(feeCollectionStep.action.fromToken.priceUSD);
  }

  return (
    <Card selectionColor="secondary" {...props}>
      <Box display="flex" alignItems="center" px={2} py={1.75}>
        <Box display="flex" flex={1} alignItems="center" justifyContent="left">
          <TokenRate route={route} />
        </Box>
        <Collapse timeout={100} in={!cardExpanded} mountOnEnter>
          <FeeBreakdownTooltip gasCosts={gasCosts} feeCosts={feeCosts}>
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
                data-value={combinedFeesUSD}
              >
                {t(`format.currency`, { value: combinedFeesUSD })}
              </Typography>
            </Box>
          </FeeBreakdownTooltip>
        </Collapse>
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
            <FeeBreakdownTooltip gasCosts={gasCosts}>
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
              <FeeBreakdownTooltip feeCosts={feeCosts}>
                <Typography variant="body2">
                  {t(`format.currency`, {
                    value: feeCostUSD,
                  })}
                </Typography>
              </FeeBreakdownTooltip>
            </Box>
          ) : null}
          {feeAmountUSD ? (
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2">
                {feeConfig?.name
                  ? t('main.fees.integrator', { tool: feeConfig.name })
                  : t('main.fees.defaultIntegrator')}
              </Typography>
              {feeConfig?.name ? (
                <Tooltip
                  title={t('tooltip.feeCollection', { tool: feeConfig.name })}
                  sx={{ cursor: 'help' }}
                >
                  <Typography variant="body2">
                    {t(`format.currency`, {
                      value: feeAmountUSD,
                    })}
                  </Typography>
                </Tooltip>
              ) : (
                <Typography variant="body2">
                  {t(`format.currency`, {
                    value: feeAmountUSD,
                  })}
                </Typography>
              )}
            </Box>
          ) : null}
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2">{t('main.priceImpact')}</Typography>
            <Tooltip title={t('tooltip.priceImpact')} sx={{ cursor: 'help' }}>
              <Typography variant="body2">
                {t('format.percent', { value: priceImpact })}
              </Typography>
            </Tooltip>
          </Box>
          {!isRouteDone(route) ? (
            <>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2">{t('main.maxSlippage')}</Typography>
                <Tooltip title={t('tooltip.slippage')} sx={{ cursor: 'help' }}>
                  <Typography variant="body2">
                    {t('format.percent', {
                      value: route.steps[0].action.slippage,
                    })}
                  </Typography>
                </Tooltip>
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
