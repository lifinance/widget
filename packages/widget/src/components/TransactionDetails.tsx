import type { RouteExtended } from '@lifi/sdk'
import { isGaslessStep } from '@lifi/sdk'
import {
  ExpandLess,
  ExpandMore,
  LocalGasStationRounded,
} from '@mui/icons-material'
import type { CardProps } from '@mui/material'
import { Box, Collapse, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { isRouteDone } from '../stores/routes/utils.js'
import { getAccumulatedFeeCostsBreakdown } from '../utils/fees.js'
import { formatTokenAmount, formatTokenPrice } from '../utils/format.js'
import { getPriceImpact } from '../utils/getPriceImpact.js'
import { Card } from './Card/Card.js'
import { CardIconButton } from './Card/CardIconButton.js'
import { FeeBreakdownTooltip } from './FeeBreakdownTooltip.js'
import { IconTypography } from './IconTypography.js'
import { TokenRate } from './TokenRate/TokenRate.js'

interface TransactionDetailsProps extends CardProps {
  route: RouteExtended
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  route,
  ...props
}) => {
  const { t } = useTranslation()
  const { feeConfig } = useWidgetConfig()
  const [cardExpanded, setCardExpanded] = useState(false)

  const toggleCard = () => {
    setCardExpanded((cardExpanded) => !cardExpanded)
  }
  const { gasCosts, feeCosts, gasCostUSD, feeCostUSD, combinedFeesUSD } =
    getAccumulatedFeeCostsBreakdown(route)

  const priceImpact = getPriceImpact({
    fromAmount: BigInt(route.fromAmount),
    toAmount: BigInt(route.toAmount),
    fromToken: route.fromToken,
    toToken: route.toToken,
  })

  const feeCollectionStep = route.steps[0].includedSteps.find(
    (includedStep) => includedStep.tool === 'feeCollection'
  )

  let feeAmountUSD = 0

  if (feeCollectionStep) {
    const estimatedFromAmount =
      BigInt(feeCollectionStep.estimate.fromAmount) -
      BigInt(feeCollectionStep.estimate.toAmount)

    feeAmountUSD = formatTokenPrice(
      estimatedFromAmount,
      feeCollectionStep.action.fromToken.priceUSD,
      feeCollectionStep.action.fromToken.decimals
    )
  }

  const hasGaslessSupport = route.steps.some(isGaslessStep)

  const showIntegratorFeeCollectionDetails =
    (feeAmountUSD || Number.isFinite(feeConfig?.fee)) && !hasGaslessSupport

  return (
    <Card selectionColor="secondary" {...props}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1.75,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'left',
          }}
        >
          <TokenRate route={route} />
        </Box>
        <Collapse timeout={100} in={!cardExpanded} mountOnEnter>
          <FeeBreakdownTooltip
            gasCosts={gasCosts}
            feeCosts={feeCosts}
            relayerSupport={hasGaslessSupport}
          >
            <Box
              onClick={toggleCard}
              // biome-ignore lint/a11y/useSemanticElements:
              role="button"
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1,
                cursor: 'pointer',
              }}
            >
              <IconTypography mr={0.5} fontSize={16}>
                <LocalGasStationRounded fontSize="inherit" />
              </IconTypography>
              <Typography
                data-value={hasGaslessSupport ? 0 : combinedFeesUSD}
                sx={{
                  fontSize: 14,
                  color: 'text.primary',
                  fontWeight: 600,
                  lineHeight: 1.429,
                }}
              >
                {hasGaslessSupport
                  ? t('main.fees.free')
                  : t('format.currency', { value: combinedFeesUSD })}
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
        <Box
          sx={{
            px: 2,
            pb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.5,
            }}
          >
            <Typography variant="body2">{t('main.fees.network')}</Typography>
            <FeeBreakdownTooltip
              gasCosts={gasCosts}
              relayerSupport={hasGaslessSupport}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, cursor: 'help' }}
              >
                {hasGaslessSupport
                  ? t('main.fees.free')
                  : t('format.currency', {
                      value: gasCostUSD,
                    })}
              </Typography>
            </FeeBreakdownTooltip>
          </Box>
          {feeCosts.length ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 0.5,
              }}
            >
              <Typography variant="body2">{t('main.fees.provider')}</Typography>
              <FeeBreakdownTooltip feeCosts={feeCosts}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, cursor: 'help' }}
                >
                  {t('format.currency', {
                    value: feeCostUSD,
                  })}
                </Typography>
              </FeeBreakdownTooltip>
            </Box>
          ) : null}
          {showIntegratorFeeCollectionDetails ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 0.5,
              }}
            >
              <Typography variant="body2">
                {feeConfig?.name
                  ? t('main.fees.integrator', { tool: feeConfig.name })
                  : t('main.fees.defaultIntegrator')}
              </Typography>
              {feeConfig?.name ? (
                <Tooltip
                  title={t('tooltip.feeCollection', { tool: feeConfig.name })}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, cursor: 'help' }}
                  >
                    {t('format.currency', {
                      value: feeAmountUSD,
                    })}
                  </Typography>
                </Tooltip>
              ) : (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t('format.currency', {
                    value: feeAmountUSD,
                  })}
                </Typography>
              )}
            </Box>
          ) : null}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.5,
            }}
          >
            <Typography variant="body2">{t('main.priceImpact')}</Typography>
            <Tooltip title={t('tooltip.priceImpact')}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, cursor: 'help' }}
              >
                {t('format.percent', { value: priceImpact })}
              </Typography>
            </Tooltip>
          </Box>
          {!isRouteDone(route) ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <Typography variant="body2">{t('main.maxSlippage')}</Typography>
                <Tooltip title={t('tooltip.slippage')}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, cursor: 'help' }}
                  >
                    {route.steps[0].action.slippage
                      ? t('format.percent', {
                          value: route.steps[0].action.slippage,
                        })
                      : t('button.auto')}
                  </Typography>
                </Tooltip>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2">{t('main.minReceived')}</Typography>
                <Tooltip title={t('tooltip.minReceived')}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, cursor: 'help' }}
                  >
                    {t('format.tokenAmount', {
                      value: formatTokenAmount(
                        BigInt(route.toAmountMin),
                        route.toToken.decimals
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
  )
}
