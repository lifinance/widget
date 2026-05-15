import type { Route, RouteExtended } from '@lifi/sdk'
import {
  DetailInfoIcon,
  DetailLabel,
  DetailLabelContainer,
  DetailRow,
  DetailValue,
  FeeBreakdownTooltip,
  formatTokenAmount,
  formatTokenPrice,
  getAccumulatedFeeCostsBreakdown,
  getPriceImpact,
  useWidgetConfig,
} from '@lifi/widget/shared'
import { Box, Tooltip } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'

interface DepositDetailsProps {
  route: Route
}

export function DepositDetails({ route }: DepositDetailsProps): JSX.Element {
  const { t } = useTranslation()
  const { feeConfig } = useWidgetConfig()

  const { gasCosts, feeCosts, gasCostUSD, feeCostUSD } =
    getAccumulatedFeeCostsBreakdown(route as RouteExtended)

  const priceImpact = getPriceImpact({
    fromAmount: BigInt(route.fromAmount),
    toAmount: BigInt(route.toAmount),
    fromToken: route.fromToken,
    toToken: route.toToken,
  })

  let feeAmountUSD = 0
  let feePercentage = 0
  const feeCollectionStep = route.steps[0]?.includedSteps?.find(
    (step) => step.tool === 'feeCollection'
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
        (acc, cost) => acc + Number.parseFloat(cost.percentage || '0'),
        0
      ) ?? 0
  }
  const showIntegratorFee = !!feeAmountUSD || Number.isFinite(feeConfig?.fee)

  const slippage = route.steps[0]?.action.slippage

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 1.5 }}>
      <DetailRow>
        <DetailLabelContainer>
          <DetailLabel>{t('main.fees.network')}</DetailLabel>
          <FeeBreakdownTooltip gasCosts={gasCosts}>
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
      {showIntegratorFee ? (
        <DetailRow>
          <DetailLabelContainer>
            <DetailLabel>
              {feeConfig?.name || t('main.fees.defaultIntegrator')}
              {feeConfig?.showFeePercentage ? (
                <> ({t('format.percent', { value: feePercentage })})</>
              ) : null}
            </DetailLabel>
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
      <DetailRow>
        <DetailLabelContainer>
          <DetailLabel>{t('main.maxSlippage')}</DetailLabel>
          <Tooltip title={t('tooltip.slippage')}>
            <DetailInfoIcon />
          </Tooltip>
        </DetailLabelContainer>
        <DetailValue>
          {slippage
            ? t('format.percent', { value: slippage })
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
    </Box>
  )
}
