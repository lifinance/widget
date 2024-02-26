import type { LiFiStep, StepExtended } from '@lifi/sdk';
import { ArrowForward, ExpandLess, ExpandMore } from '@mui/icons-material';
import type { StepIconProps } from '@mui/material';
import {
  Badge,
  Box,
  Collapse,
  Step as MuiStep,
  Stepper,
  Typography,
} from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatUnits } from 'viem';
import { useAvailableChains } from '../../hooks/useAvailableChains.js';
import { LiFiToolLogo } from '../../icons/lifi.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import type { WidgetSubvariant } from '../../types/widget.js';
import { formatTokenAmount } from '../../utils/format.js';
import { CardIconButton } from '../Card/CardIconButton.js';
import { SmallAvatar } from '../SmallAvatar.js';
import {
  StepAvatar,
  StepConnector,
  StepContent,
  StepLabel,
  StepLabelTypography,
} from './StepActions.style.js';
import { StepFeeBreakdown } from './StepFeeBreakdown.js';
import { StepFees } from './StepFees.js';
import type { StepActionsProps, StepDetailsLabelProps } from './types.js';

export const StepActions: React.FC<StepActionsProps> = ({
  step,
  dense,
  ...other
}) => {
  const { t } = useTranslation();
  const { subvariant } = useWidgetConfig();
  const [cardExpanded, setCardExpanded] = useState(false);

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setCardExpanded((expanded) => !expanded);
  };

  // FIXME: step transaction request overrides step tool details, but not included step tool details
  const toolDetails =
    subvariant === 'nft'
      ? step.includedSteps.find(
          (step) => step.tool === 'custom' && step.toolDetails.key !== 'custom',
        )?.toolDetails || step.toolDetails
      : step.toolDetails;

  return (
    <Box {...other}>
      <Box display="flex" alignItems="center">
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={<SmallAvatar src={LiFiToolLogo} />}
        >
          <StepAvatar
            variant="circular"
            src={toolDetails.logoURI ?? LiFiToolLogo}
            alt={toolDetails.name}
          >
            {toolDetails.name[0]}
          </StepAvatar>
        </Badge>
        <Box flex={1}>
          <Typography fontSize={18} fontWeight="500" lineHeight={1.3334} ml={2}>
            {t(`main.stepDetails`, {
              tool: toolDetails.name,
            })}
          </Typography>
          <Collapse
            timeout={225}
            in={dense && !cardExpanded}
            mountOnEnter
            unmountOnExit
          >
            <StepFees ml={2} step={step} />
          </Collapse>
        </Box>
        {dense ? (
          <CardIconButton onClick={handleExpand} size="small">
            {cardExpanded ? <ExpandLess /> : <ExpandMore />}
          </CardIconButton>
        ) : null}
      </Box>
      {dense ? (
        <Collapse timeout={225} in={cardExpanded} mountOnEnter unmountOnExit>
          <IncludedSteps step={step} subvariant={subvariant} />
          <StepFeeBreakdown step={step} />
        </Collapse>
      ) : (
        <IncludedSteps step={step} subvariant={subvariant} />
      )}
    </Box>
  );
};

export const IncludedSteps: React.FC<{
  step: LiFiStep;
  subvariant?: WidgetSubvariant;
}> = ({ step, subvariant }) => {
  // eslint-disable-next-line react/no-unstable-nested-components
  const StepIconComponent = ({ icon }: StepIconProps) => {
    const tool = step.includedSteps?.[Number(icon) - 1];
    return tool ? (
      <SmallAvatar
        src={tool.toolDetails.logoURI}
        alt={tool.toolDetails.name}
        sx={{ width: 20, height: 20 }}
      >
        {tool.toolDetails.name[0]}
      </SmallAvatar>
    ) : null;
  };
  return (
    <Box mt={1}>
      <Stepper
        orientation="vertical"
        connector={<StepConnector />}
        activeStep={-1}
      >
        {step.includedSteps.map((step, i, includedSteps) => (
          <MuiStep key={step.id} expanded>
            <StepLabel StepIconComponent={StepIconComponent}>
              {step.type === 'custom' && subvariant === 'nft' ? (
                <CustomStepDetailsLabel step={step} subvariant={subvariant} />
              ) : step.type === 'cross' ? (
                <CrossStepDetailsLabel step={step} />
              ) : step.type === 'protocol' ? (
                <ProtocolStepDetailsLabel step={step} />
              ) : (
                <SwapStepDetailsLabel step={step} />
              )}
            </StepLabel>
            <StepContent last={i === includedSteps.length - 1}>
              <StepDetailsContent step={step} subvariant={subvariant} />
            </StepContent>
          </MuiStep>
        ))}
      </Stepper>
    </Box>
  );
};

export const StepDetailsContent: React.FC<{
  step: StepExtended;
  subvariant?: WidgetSubvariant;
}> = ({ step, subvariant }) => {
  const { t } = useTranslation();

  const sameTokenProtocolStep =
    step.action.fromToken.chainId === step.action.toToken.chainId &&
    step.action.fromToken.address === step.action.toToken.address;

  let fromAmount: string | undefined;
  if (sameTokenProtocolStep) {
    const estimatedFromAmount =
      BigInt(step.estimate.fromAmount) - BigInt(step.estimate.toAmount);

    fromAmount =
      estimatedFromAmount > 0n
        ? formatUnits(estimatedFromAmount, step.action.fromToken.decimals)
        : formatUnits(
            BigInt(step.estimate.fromAmount),
            step.action.fromToken.decimals,
          );
  } else {
    fromAmount = formatTokenAmount(
      BigInt(step.estimate.fromAmount),
      step.action.fromToken.decimals,
    );
  }

  const showToAmount =
    step.type !== 'custom' && step.tool !== 'custom' && !sameTokenProtocolStep;

  return (
    <Typography
      fontSize={12}
      lineHeight={1}
      fontWeight="500"
      color="text.secondary"
      alignItems="center"
      display="flex"
    >
      {!showToAmount ? (
        <>
          {formatUnits(
            BigInt(step.estimate.fromAmount),
            step.action.fromToken.decimals,
          )}{' '}
          {step.action.fromToken.symbol}
          {' - '}
        </>
      ) : null}
      {t('format.number', {
        value: fromAmount,
      })}{' '}
      {step.action.fromToken.symbol}
      {showToAmount ? (
        <>
          <ArrowForward sx={{ fontSize: 18, paddingX: 0.5, height: 12 }} />
          {t('format.number', {
            value: formatTokenAmount(
              BigInt(step.execution?.toAmount ?? step.estimate.toAmount),
              step.execution?.toToken?.decimals ?? step.action.toToken.decimals,
            ),
          })}{' '}
          {step.execution?.toToken?.symbol ?? step.action.toToken.symbol}
        </>
      ) : (
        ` (${t('format.currency', {
          value:
            parseFloat(fromAmount) * parseFloat(step.action.fromToken.priceUSD),
        })})`
      )}
    </Typography>
  );
};

export const CustomStepDetailsLabel: React.FC<StepDetailsLabelProps> = ({
  step,
  subvariant,
}) => {
  const { t } = useTranslation();

  if (!subvariant) {
    return null;
  }

  // FIXME: step transaction request overrides step tool details, but not included step tool details
  const toolDetails =
    subvariant === 'nft' &&
    (step as unknown as LiFiStep).includedSteps?.length > 0
      ? (step as unknown as LiFiStep).includedSteps.find(
          (step) => step.tool === 'custom' && step.toolDetails.key !== 'custom',
        )?.toolDetails || step.toolDetails
      : step.toolDetails;

  return (
    <StepLabelTypography>
      {t(`main.${subvariant}StepDetails`, {
        tool: toolDetails.name,
      })}
    </StepLabelTypography>
  );
};

export const CrossStepDetailsLabel: React.FC<
  Omit<StepDetailsLabelProps, 'variant'>
> = ({ step }) => {
  const { t } = useTranslation();
  const { getChainById } = useAvailableChains();
  return (
    <StepLabelTypography>
      {t('main.crossStepDetails', {
        from: getChainById(step.action.fromChainId)?.name,
        to: getChainById(step.action.toChainId)?.name,
        tool: step.toolDetails.name,
      })}
    </StepLabelTypography>
  );
};

export const SwapStepDetailsLabel: React.FC<
  Omit<StepDetailsLabelProps, 'variant'>
> = ({ step }) => {
  const { t } = useTranslation();
  const { getChainById } = useAvailableChains();
  return (
    <StepLabelTypography>
      {t('main.swapStepDetails', {
        chain: getChainById(step.action.fromChainId)?.name,
        tool: step.toolDetails.name,
      })}
    </StepLabelTypography>
  );
};

export const ProtocolStepDetailsLabel: React.FC<
  Omit<StepDetailsLabelProps, 'variant'>
> = ({ step }) => {
  const { t } = useTranslation();
  return (
    <StepLabelTypography>
      {step.toolDetails.key === 'lifuelProtocol'
        ? t('main.refuelStepDetails', {
            tool: step.toolDetails.name,
          })
        : step.toolDetails.name}
    </StepLabelTypography>
  );
};
