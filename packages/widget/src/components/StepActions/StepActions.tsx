import type { LiFiStep, RouteExtended, StepExtended } from '@lifi/sdk'
import { useEthereumContext } from '@lifi/widget-provider'
import ArrowForward from '@mui/icons-material/ArrowForward'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import type { StepIconProps } from '@mui/material'
import {
  Box,
  Collapse,
  Divider,
  Step as MuiStep,
  Stepper,
  Typography,
} from '@mui/material'
import type { MouseEventHandler } from 'react'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { HiddenUI } from '../../types/widget.js'
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js'
import { SmallAvatar } from '../Avatar/SmallAvatar.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import {
  StepConnector,
  StepContent,
  StepLabel,
  StepLabelTypography,
} from './StepActions.style.js'
import type { IncludedStepsProps, StepDetailsLabelProps } from './types.js'

export const StepActions: React.FC<{
  route: RouteExtended
}> = ({ route }) => {
  const { t } = useTranslation()
  const [cardExpanded, setCardExpanded] = useState(false)

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    setCardExpanded((expanded) => !expanded)
  }

  const includedSteps = route.steps.flatMap((step) => step.includedSteps)

  return (
    <Box sx={{ pb: 0.5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {t('main.route')}
        </Typography>

        <CardIconButton
          onClick={handleExpand}
          size="small"
          sx={(theme) => ({
            borderRadius: theme.vars.shape.borderRadiusSecondary,
          })}
        >
          {cardExpanded ? (
            <ExpandLess fontSize="inherit" />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {includedSteps.map((includedStep, index) => (
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
              <ExpandMore fontSize="inherit" sx={{ ml: 0.5 }} />
            </Box>
          )}
        </CardIconButton>
      </Box>
      <Collapse timeout={225} in={cardExpanded} mountOnEnter unmountOnExit>
        {route.steps.map((step) => (
          <IncludedSteps key={step.id} step={step} />
        ))}
      </Collapse>
    </Box>
  )
}

const IncludedSteps: React.FC<IncludedStepsProps> = ({ step }) => {
  const { subvariant, subvariantOptions, feeConfig, hiddenUI } =
    useWidgetConfig()
  const { isGaslessStep } = useEthereumContext()

  let includedSteps = step.includedSteps
  if (hiddenUI?.includes(HiddenUI.IntegratorStepDetails)) {
    const feeCollectionStep = includedSteps.find(
      (step) => step.tool === 'feeCollection'
    )
    if (feeCollectionStep) {
      includedSteps = structuredClone(
        includedSteps.filter((step) => step.tool !== 'feeCollection')
      )
      includedSteps[0].estimate.fromAmount =
        feeCollectionStep.estimate.fromAmount
    }
  }

  // biome-ignore lint/correctness/noNestedComponentDefinitions: part of the flow
  const StepIconComponent = ({ icon }: StepIconProps) => {
    const includedStep = includedSteps?.[Number(icon) - 1]
    const feeCollectionStep =
      includedStep?.type === 'protocol' &&
      includedStep?.tool === 'feeCollection'
    const toolName =
      feeCollectionStep && feeConfig?.name
        ? feeConfig?.name
        : includedStep?.toolDetails.name
    const toolLogoURI =
      feeCollectionStep && feeConfig?.logoURI
        ? feeConfig?.logoURI
        : includedStep?.toolDetails.logoURI
    return toolLogoURI ? (
      <SmallAvatar
        src={toolLogoURI}
        alt={toolName}
        sx={{ width: 20, height: 20 }}
      >
        {toolName?.[0]}
      </SmallAvatar>
    ) : null
  }

  const hasGaslessSupport = !!isGaslessStep?.(step)

  return (
    <Box
      sx={{
        mt: 1,
      }}
    >
      <Stepper
        orientation="vertical"
        connector={<StepConnector />}
        activeStep={-1}
      >
        {includedSteps.map((step, i, includedSteps) => (
          <MuiStep key={step.id} expanded>
            <StepLabel
              slots={{
                stepIcon: StepIconComponent,
              }}
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
            </StepLabel>
            <StepContent last={i === includedSteps.length - 1}>
              <StepDetailsContent step={step} />
            </StepContent>
          </MuiStep>
        ))}
      </Stepper>
    </Box>
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
    <Typography
      sx={{
        fontSize: 12,
        lineHeight: 1,
        fontWeight: '500',
        color: 'text.secondary',
        alignItems: 'center',
        display: 'flex',
      }}
    >
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
    </Typography>
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
