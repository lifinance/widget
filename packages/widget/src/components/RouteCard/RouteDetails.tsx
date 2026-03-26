import type { RouteExtended } from '@lifi/sdk'
import { useEthereumContext } from '@lifi/widget-provider'
import { Box, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTokenRateText } from '../../hooks/useTokenRateText.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { isRouteDone } from '../../stores/routes/utils.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import {
  formatDuration,
  formatTokenAmount,
  formatTokenPrice,
} from '../../utils/format.js'
import { getPriceImpact } from '../../utils/getPriceImpact.js'
import { FeeBreakdownTooltip } from '../FeeBreakdownTooltip.js'
import { StepActions } from '../Step/StepActions.js'
import {
  DetailInfoIcon,
  DetailLabel,
  DetailLabelContainer,
  DetailRow,
  DetailValue,
} from './RouteDetails.style.js'

interface RouteDetailsProps {
  route: RouteExtended
}

export const RouteDetails = ({ route }: RouteDetailsProps) => {
  const { t, i18n } = useTranslation()
  const { rateText, toggleRate } = useTokenRateText(route)
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

  const executionTimeSeconds = Math.floor(
    route.steps.reduce(
      (duration, step) => duration + step.estimate.executionDuration,
      0
    )
  )

  const hasGaslessSupport = route.steps.every((step) => isGaslessStep?.(step))

  const showIntegratorFeeCollectionDetails =
    (feeAmountUSD || Number.isFinite(feeConfig?.fee)) && !hasGaslessSupport

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 1.5 }}>
      <StepActions route={route} />
      <DetailRow>
        <DetailLabelContainer>
          <DetailLabel>{t('main.fees.network')}</DetailLabel>
          <FeeBreakdownTooltip gasCosts={gasCosts} gasless={hasGaslessSupport}>
            <DetailInfoIcon />
          </FeeBreakdownTooltip>
        </DetailLabelContainer>
        <DetailValue>
          {!gasCostUSD
            ? t('main.fees.free')
            : t('format.currency', { value: gasCostUSD })}
        </DetailValue>
      </DetailRow>
      {feeCosts.length ? (
        <DetailRow>
          <DetailLabelContainer>
            <DetailLabel>{t('main.fees.provider')}</DetailLabel>
            <FeeBreakdownTooltip feeCosts={feeCosts}>
              <DetailInfoIcon />
            </FeeBreakdownTooltip>
          </DetailLabelContainer>
          <DetailValue>
            {t('format.currency', { value: feeCostUSD })}
          </DetailValue>
        </DetailRow>
      ) : null}
      {showIntegratorFeeCollectionDetails ? (
        <DetailRow>
          <DetailLabelContainer>
            <DetailLabel>
              {feeConfig?.name || t('main.fees.defaultIntegrator')}
              {feeConfig?.showFeePercentage && (
                <> ({t('format.percent', { value: feePercentage })})</>
              )}
            </DetailLabel>
            {feeConfig?.showFeeTooltip &&
            (feeConfig?.name || feeConfig?.feeTooltipComponent) ? (
              <Tooltip
                title={
                  feeConfig?.feeTooltipComponent ||
                  t('tooltip.feeCollection', { tool: feeConfig.name })
                }
              >
                <DetailInfoIcon />
              </Tooltip>
            ) : null}
          </DetailLabelContainer>
          <DetailValue>
            {t('format.currency', { value: feeAmountUSD })}
          </DetailValue>
        </DetailRow>
      ) : null}
      <DetailRow>
        <DetailLabelContainer>
          <DetailLabel>{t('main.priceImpact')}</DetailLabel>
          <Tooltip title={t('tooltip.priceImpact')}>
            <DetailInfoIcon />
          </Tooltip>
        </DetailLabelContainer>
        <DetailValue>
          {t('format.percent', { value: priceImpact, usePlusSign: true })}
        </DetailValue>
      </DetailRow>
      {!isRouteDone(route) ? (
        <>
          <DetailRow>
            <DetailLabelContainer>
              <DetailLabel>{t('main.maxSlippage')}</DetailLabel>
              <Tooltip title={t('tooltip.slippage')}>
                <DetailInfoIcon />
              </Tooltip>
            </DetailLabelContainer>
            <DetailValue>
              {route.steps[0].action.slippage
                ? t('format.percent', {
                    value: route.steps[0].action.slippage,
                  })
                : t('button.auto')}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabelContainer>
              <DetailLabel>{t('main.minReceived')}</DetailLabel>
              <Tooltip title={t('tooltip.minReceived')}>
                <DetailInfoIcon />
              </Tooltip>
            </DetailLabelContainer>
            <DetailValue>
              {t('format.tokenAmount', {
                value: formatTokenAmount(
                  BigInt(route.toAmountMin),
                  route.toToken.decimals
                ),
              })}{' '}
              {route.toToken.symbol}
            </DetailValue>
          </DetailRow>
        </>
      ) : null}
      <DetailRow>
        <DetailLabelContainer>
          <DetailLabel>{t('main.exchangeRate')}</DetailLabel>
          <Tooltip title={t('tooltip.exchangeRate')}>
            <DetailInfoIcon />
          </Tooltip>
        </DetailLabelContainer>
        <DetailValue
          onClick={toggleRate}
          role="button"
          sx={{ cursor: 'pointer' }}
        >
          {rateText}
        </DetailValue>
      </DetailRow>
      <DetailRow>
        <DetailLabelContainer>
          <DetailLabel>{t('main.estimatedTime')}</DetailLabel>
          <Tooltip title={t('tooltip.estimatedTime')}>
            <DetailInfoIcon />
          </Tooltip>
        </DetailLabelContainer>
        <DetailValue>
          {formatDuration(executionTimeSeconds, i18n.language)}
        </DetailValue>
      </DetailRow>
    </Box>
  )
}
