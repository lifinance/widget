import type { LiFiStep, StepExtended } from '@lifi/sdk'
import { isRelayerStep } from '@lifi/sdk'
import ArrowForward from '@mui/icons-material/ArrowForward'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import type { StepIconProps } from '@mui/material'
import {
  Badge,
  Box,
  Collapse,
  Step as MuiStep,
  Stepper,
  Typography,
} from '@mui/material'
import type { MouseEventHandler } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { lifiLogoUrl } from '../../icons/lifi.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { HiddenUI } from '../../types/widget.js'
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js'
import { SmallAvatar } from '../Avatar/SmallAvatar.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import {
  StepAvatar,
  StepConnector,
  StepContent,
  StepLabel,
  StepLabelTypography,
} from './StepActions.style.js'
import type {
  IncludedStepsProps,
  StepActionsProps,
  StepDetailsLabelProps,
} from './types.js'

export const StepActions: React.FC<StepActionsProps> = ({
  step,
  dense,
  ...other
}) => {
  const { t } = useTranslation()
  const { subvariant } = useWidgetConfig()
  const [cardExpanded, setCardExpanded] = useState(false)

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    setCardExpanded((expanded) => !expanded)
  }

  // FIXME: step transaction request overrides step tool details, but not included step tool details
  const toolDetails =
    subvariant === 'custom'
      ? step.includedSteps.find(
          (step) => step.tool === 'custom' && step.toolDetails.key !== 'custom'
        )?.toolDetails || step.toolDetails
      : step.toolDetails

  return (
    <Box {...other}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={<SmallAvatar src={lifiLogoUrl} />}
        >
          <StepAvatar
            variant="circular"
            src={toolDetails.logoURI ?? lifiLogoUrl}
            alt={toolDetails.name}
          >
            {toolDetails.name[0]}
          </StepAvatar>
        </Badge>
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.3334,
              ml: 2,
            }}
          >
            {toolDetails.name?.includes('LI.FI')
              ? toolDetails.name
              : t('main.stepDetails', {
                  tool: toolDetails.name,
                })}
          </Typography>
          {/* <StepFees ml={2} step={step} /> */}
        </Box>
        {dense ? (
          <CardIconButton onClick={handleExpand} size="small">
            {cardExpanded ? (
              <ExpandLess fontSize="inherit" />
            ) : (
              <ExpandMore fontSize="inherit" />
            )}
          </CardIconButton>
        ) : null}
      </Box>
      {dense ? (
        <Collapse timeout={225} in={cardExpanded} mountOnEnter unmountOnExit>
          <IncludedSteps step={step} />
        </Collapse>
      ) : (
        <IncludedSteps step={step} />
      )}
    </Box>
  )
}

export const IncludedSteps: React.FC<IncludedStepsProps> = ({ step }) => {
  const { subvariant, subvariantOptions, feeConfig, hiddenUI } =
    useWidgetConfig()

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

  const hasRelayerSupport = isRelayerStep(step)

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
                  relayerSupport={hasRelayerSupport}
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

export const StepDetailsContent: React.FC<{
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

export const CustomStepDetailsLabel: React.FC<StepDetailsLabelProps> = ({
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

export const BridgeStepDetailsLabel: React.FC<
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

export const SwapStepDetailsLabel: React.FC<
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

export const ProtocolStepDetailsLabel: React.FC<
  Omit<StepDetailsLabelProps, 'variant'>
> = ({ step, feeConfig, relayerSupport }) => {
  const { t } = useTranslation()
  return (
    <StepLabelTypography>
      {step.toolDetails.key === 'feeCollection'
        ? feeConfig?.name
          ? t('main.fees.integrator', { tool: feeConfig.name })
          : relayerSupport
            ? t('main.fees.relayerService')
            : t('main.fees.defaultIntegrator')
        : step.toolDetails.key === 'gasZip'
          ? t('main.refuelStepDetails', {
              tool: step.toolDetails.name,
            })
          : step.toolDetails.name}
    </StepLabelTypography>
  )
}
