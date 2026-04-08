import type { LiFiStep, RouteExtended, StepExtended } from '@lifi/sdk'
import { useEthereumContext } from '@lifi/widget-provider'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { Box, Divider, Tooltip } from '@mui/material'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import {
  HiddenUI,
  type SubvariantOptions,
  type WidgetFeeConfig,
  type WidgetSubvariant,
} from '../../types/widget.js'
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js'
import { SmallAvatar } from '../Avatar/SmallAvatar.js'
import { Card } from '../Card/Card.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import {
  StepActionsHeader,
  StepActionsTitle,
  StepLabelTypography,
} from './StepActions.style.js'

interface StepDetailsLabelProps {
  step: StepExtended
  subvariant?: Extract<WidgetSubvariant, 'custom'>
  subvariantOptions?: SubvariantOptions
  feeConfig?: WidgetFeeConfig
  relayerSupport?: boolean
}

export const StepActions: React.FC<{
  route: RouteExtended
}> = ({ route }) => {
  const { t } = useTranslation()
  const { subvariant, subvariantOptions, feeConfig, hiddenUI } =
    useWidgetConfig()
  const { isGaslessStep } = useEthereumContext()

  const headerIncludedSteps = route.steps.flatMap((step) => step.includedSteps)

  const flatSteps = route.steps.flatMap((routeStep) => {
    let steps = routeStep.includedSteps
    if (hiddenUI?.includes(HiddenUI.IntegratorStepDetails)) {
      const feeCollectionStep = steps.find((s) => s.tool === 'feeCollection')
      if (feeCollectionStep) {
        steps = structuredClone(steps.filter((s) => s.tool !== 'feeCollection'))
        steps[0].estimate.fromAmount = feeCollectionStep.estimate.fromAmount
      }
    }
    const hasGaslessSupport = !!isGaslessStep?.(routeStep)
    return steps.map((includedStep) => ({ includedStep, hasGaslessSupport }))
  })

  const tooltipContent = (
    <Card indented>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '32px 1fr',
          columnGap: 1.5,
        }}
      >
        {flatSteps.map(({ includedStep: step, hasGaslessSupport }, i, arr) => {
          const showDivider = i !== arr.length - 1
          const isFeeCollection =
            step.type === 'protocol' && step.tool === 'feeCollection'
          const toolName =
            isFeeCollection && feeConfig?.name
              ? feeConfig.name
              : step.toolDetails.name
          const toolLogoURI =
            isFeeCollection && feeConfig?.logoURI
              ? feeConfig.logoURI
              : step.toolDetails.logoURI

          return (
            <Fragment key={step.id}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {toolLogoURI ? (
                  <SmallAvatar
                    src={toolLogoURI}
                    alt={toolName}
                    sx={{ width: 32, height: 32 }}
                  >
                    {toolName?.[0]}
                  </SmallAvatar>
                ) : null}
              </Box>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', minHeight: 32 }}
              >
                {step.type === 'custom' && subvariant === 'custom' ? (
                  <CustomStepDetailsLabel
                    step={step}
                    subvariant={subvariant}
                    subvariantOptions={subvariantOptions}
                  />
                ) : step.type === 'cross' ? (
                  <BridgeStepDetailsLabel step={step} />
                ) : step.type === 'protocol' ? (
                  <ProtocolStepDetailsLabel
                    step={step}
                    feeConfig={feeConfig}
                    relayerSupport={hasGaslessSupport}
                  />
                ) : (
                  <SwapStepDetailsLabel step={step} />
                )}
                <StepDetailsContent step={step} />
              </Box>
              {showDivider && (
                <Box sx={{ display: 'flex', alignItems: 'center', px: '15px' }}>
                  <Divider
                    orientation="vertical"
                    sx={{ my: 0.5, height: 8, borderRightWidth: 2 }}
                  />
                </Box>
              )}
              {showDivider && <Box />}
            </Fragment>
          )
        })}
      </Box>
    </Card>
  )

  return (
    <StepActionsHeader>
      <StepActionsTitle>{t('main.route')}</StepActionsTitle>
      <Tooltip
        title={tooltipContent}
        placement="bottom-end"
        arrow={false}
        slotProps={{
          tooltip: {
            sx: {
              bgcolor: 'transparent',
              p: 0,
              boxShadow: 'none',
              maxWidth: 'none',
            },
          },
          transition: {
            style: { transformOrigin: 'right top' },
          },
        }}
      >
        <CardIconButton
          size="small"
          sx={(theme) => ({
            borderRadius: theme.vars.shape.borderRadiusSecondary,
          })}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {headerIncludedSteps.map((includedStep, index) => (
              <Fragment key={index}>
                {index > 0 ? (
                  <Divider sx={{ width: 8, mx: 0.5, borderWidth: 1 }} />
                ) : null}
                <SmallAvatar
                  src={includedStep.toolDetails.logoURI}
                  alt={includedStep.toolDetails.name}
                  sx={{ width: 16, height: 16 }}
                >
                  {includedStep.toolDetails.name[0]}
                </SmallAvatar>
              </Fragment>
            ))}
          </Box>
        </CardIconButton>
      </Tooltip>
    </StepActionsHeader>
  )
}

const StepDetailsContent: React.FC<{
  step: StepExtended
}> = ({ step }) => {
  const { t } = useTranslation()

  const sameTokenProtocolStep =
    step.action.fromToken.chainId === step.action.toToken.chainId &&
    step.action.fromToken.address === step.action.toToken.address

  let fromAmount: string | undefined
  if (sameTokenProtocolStep) {
    const estimatedFromAmount =
      BigInt(step.estimate.fromAmount) - BigInt(step.estimate.toAmount)

    fromAmount =
      estimatedFromAmount > 0n
        ? formatTokenAmount(estimatedFromAmount, step.action.fromToken.decimals)
        : formatTokenAmount(
            BigInt(step.estimate.fromAmount),
            step.action.fromToken.decimals
          )
  } else {
    fromAmount = formatTokenAmount(
      BigInt(step.estimate.fromAmount),
      step.action.fromToken.decimals
    )
  }

  const showToAmount =
    step.type !== 'custom' && step.tool !== 'custom' && !sameTokenProtocolStep

  return (
    <StepLabelTypography>
      {!showToAmount ? (
        <>
          {t('format.tokenAmount', {
            value: formatTokenAmount(
              BigInt(step.estimate.fromAmount),
              step.action.fromToken.decimals
            ),
          })}{' '}
          {step.action.fromToken.symbol}
          {' - '}
        </>
      ) : null}
      {t('format.tokenAmount', {
        value: fromAmount,
      })}{' '}
      {step.action.fromToken.symbol}
      {showToAmount ? (
        <>
          <ArrowForward sx={{ fontSize: 18, paddingX: 0.5, height: 12 }} />
          {t('format.tokenAmount', {
            value: formatTokenAmount(
              BigInt(step.execution?.toAmount ?? step.estimate.toAmount),
              step.execution?.toToken?.decimals ?? step.action.toToken.decimals
            ),
          })}{' '}
          {step.execution?.toToken?.symbol ?? step.action.toToken.symbol}
        </>
      ) : (
        ` (${t('format.currency', {
          value: formatTokenPrice(
            fromAmount,
            step.action.fromToken.priceUSD,
            step.action.fromToken.decimals
          ),
        })})`
      )}
    </StepLabelTypography>
  )
}

const CustomStepDetailsLabel: React.FC<StepDetailsLabelProps> = ({
  step,
  subvariant,
  subvariantOptions,
}) => {
  const { t } = useTranslation()

  if (!subvariant) {
    return null
  }

  // FIXME: step transaction request overrides step tool details, but not included step tool details
  const toolDetails =
    subvariant === 'custom' &&
    (step as unknown as LiFiStep).includedSteps?.length > 0
      ? (step as unknown as LiFiStep).includedSteps.find(
          (step) => step.tool === 'custom' && step.toolDetails.key !== 'custom'
        )?.toolDetails || step.toolDetails
      : step.toolDetails

  const stepDetailsKey =
    (subvariant === 'custom' && subvariantOptions?.custom) || 'checkout'

  return (
    <StepLabelTypography>
      {t(`main.${stepDetailsKey}StepDetails`, {
        tool: toolDetails.name,
      })}
    </StepLabelTypography>
  )
}

const BridgeStepDetailsLabel: React.FC<
  Omit<StepDetailsLabelProps, 'variant'>
> = ({ step }) => {
  const { t } = useTranslation()
  const { getChainById } = useAvailableChains()
  return (
    <StepLabelTypography>
      {t('main.bridgeStepDetails', {
        from: getChainById(step.action.fromChainId)?.name,
        to: getChainById(step.action.toChainId)?.name,
        tool: step.toolDetails.name,
      })}
    </StepLabelTypography>
  )
}

const SwapStepDetailsLabel: React.FC<
  Omit<StepDetailsLabelProps, 'variant'>
> = ({ step }) => {
  const { t } = useTranslation()
  const { getChainById } = useAvailableChains()
  return (
    <StepLabelTypography>
      {t('main.swapStepDetails', {
        chain: getChainById(step.action.fromChainId)?.name,
        tool: step.toolDetails.name,
      })}
    </StepLabelTypography>
  )
}

const ProtocolStepDetailsLabel: React.FC<
  Omit<StepDetailsLabelProps, 'variant'>
> = ({ step, feeConfig, relayerSupport }) => {
  const { t } = useTranslation()
  return (
    <StepLabelTypography>
      {step.toolDetails.key === 'feeCollection'
        ? feeConfig?.name ||
          (relayerSupport
            ? t('main.fees.relayerService')
            : t('main.fees.defaultIntegrator'))
        : step.toolDetails.key === 'gasZip'
          ? t('main.refuelStepDetails', {
              tool: step.toolDetails.name,
            })
          : step.toolDetails.name}
    </StepLabelTypography>
  )
}
