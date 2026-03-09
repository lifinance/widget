import type { RouteExtended } from '@lifi/sdk'
import { useEthereumContext } from '@lifi/widget-provider'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { Box, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { isRouteDone } from '../../stores/routes/utils.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js'
import { getPriceImpact } from '../../utils/getPriceImpact.js'
import { FeeBreakdownTooltip } from '../FeeBreakdownTooltip.js'
import { StepActions } from '../StepActions/StepActions.js'

interface RouteDetailsProps {
  route: RouteExtended
}

export const RouteDetails = ({ route }: RouteDetailsProps) => {
  const { t } = useTranslation()

  const { feeConfig } = useWidgetConfig()

  const { isGaslessStep } = useEthereumContext()

  const { gasCosts, feeCosts, gasCostUSD, feeCostUSD } =
    getAccumulatedFeeCostsBreakdown(route)

  const priceImpact = getPriceImpact({
    fromAmount: BigInt(route.fromAmount),
    toAmount: BigInt(route.toAmount),
    fromToken: route.fromToken,
    toToken: route.toToken,
  })

  let feeAmountUSD = 0
  let feePercentage = 0

  const feeCollectionStep = route.steps[0].includedSteps.find(
    (includedStep) => includedStep.tool === 'feeCollection'
  )

  if (feeCollectionStep) {
    const estimatedFromAmount =
      BigInt(feeCollectionStep.estimate.fromAmount) -
      BigInt(feeCollectionStep.estimate.toAmount)

    feeAmountUSD = formatTokenPrice(
      estimatedFromAmount,
      feeCollectionStep.action.fromToken.priceUSD,
      feeCollectionStep.action.fromToken.decimals
    )

    feePercentage =
      feeCollectionStep.estimate.feeCosts?.reduce(
        (percentage, feeCost) =>
          percentage + Number.parseFloat(feeCost.percentage || '0'),
        0
      ) ?? 0
  }

  const hasGaslessSupport = route.steps.every((step) => isGaslessStep?.(step))

  const showIntegratorFeeCollectionDetails =
    (feeAmountUSD || Number.isFinite(feeConfig?.fee)) && !hasGaslessSupport

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 1 }}>
      {route.steps.map((step) => (
        <StepActions key={step.id} step={step} px={2} py={1} dense />
      ))}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="body2">{t('main.fees.network')}</Typography>
          <FeeBreakdownTooltip gasCosts={gasCosts} gasless={hasGaslessSupport}>
            <InfoOutlined
              sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }}
            />
          </FeeBreakdownTooltip>
        </Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, textAlign: 'right' }}
        >
          {!gasCostUSD
            ? t('main.fees.free')
            : t('format.currency', {
                value: gasCostUSD,
              })}
        </Typography>
      </Box>
      {feeCosts.length ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2">{t('main.fees.provider')}</Typography>
            <FeeBreakdownTooltip feeCosts={feeCosts}>
              <InfoOutlined
                sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }}
              />
            </FeeBreakdownTooltip>
          </Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, textAlign: 'right' }}
          >
            {t('format.currency', {
              value: feeCostUSD,
            })}
          </Typography>
        </Box>
      ) : null}
      {showIntegratorFeeCollectionDetails ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2">
              {feeConfig?.name || t('main.fees.defaultIntegrator')}
              {feeConfig?.showFeePercentage && (
                <> ({t('format.percent', { value: feePercentage })})</>
              )}
            </Typography>
            {feeConfig?.showFeeTooltip &&
            (feeConfig?.name || feeConfig?.feeTooltipComponent) ? (
              <Tooltip
                title={
                  feeConfig?.feeTooltipComponent ||
                  t('tooltip.feeCollection', { tool: feeConfig.name })
                }
              >
                <InfoOutlined
                  sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }}
                />
              </Tooltip>
            ) : null}
          </Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, textAlign: 'right' }}
          >
            {t('format.currency', {
              value: feeAmountUSD,
            })}
          </Typography>
        </Box>
      ) : null}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="body2">{t('main.priceImpact')}</Typography>
          <Tooltip title={t('tooltip.priceImpact')}>
            <InfoOutlined
              sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }}
            />
          </Tooltip>
        </Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, textAlign: 'right' }}
        >
          {t('format.percent', {
            value: priceImpact,
            usePlusSign: true,
          })}
        </Typography>
      </Box>
      {!isRouteDone(route) ? (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2">{t('main.maxSlippage')}</Typography>
              <Tooltip title={t('tooltip.slippage')}>
                <InfoOutlined
                  sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }}
                />
              </Tooltip>
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, textAlign: 'right' }}
            >
              {route.steps[0].action.slippage
                ? t('format.percent', {
                    value: route.steps[0].action.slippage,
                  })
                : t('button.auto')}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2">{t('main.minReceived')}</Typography>
              <Tooltip title={t('tooltip.minReceived')}>
                <InfoOutlined
                  sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }}
                />
              </Tooltip>
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, textAlign: 'right' }}
            >
              {t('format.tokenAmount', {
                value: formatTokenAmount(
                  BigInt(route.toAmountMin),
                  route.toToken.decimals
                ),
              })}{' '}
              {route.toToken.symbol}
            </Typography>
          </Box>
        </>
      ) : null}
    </Box>
  )
}
