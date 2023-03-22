import type { LifiStep, Step } from '@lifi/sdk';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { StepIconProps } from '@mui/material';
import {
  Badge,
  Box,
  Collapse,
  Step as MuiStep,
  Stepper,
  Typography,
} from '@mui/material';
import Big from 'big.js';
import type { MouseEventHandler } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChains } from '../../hooks';
import { LiFiToolLogo } from '../../icons';
import { useWidgetConfig } from '../../providers';
import type { WidgetVariant } from '../../types';
import { formatTokenAmount } from '../../utils';
import { CardIconButton } from '../Card';
import { SmallAvatar } from '../SmallAvatar';
import {
  StepAvatar,
  StepConnector,
  StepContent,
  StepLabel,
} from './StepActions.style';
import type { StepActionsProps, StepDetailsLabelProps } from './types';

export const StepActions: React.FC<StepActionsProps> = ({
  step,
  dense,
  ...other
}) => {
  const { t } = useTranslation();
  const { variant, contractTool } = useWidgetConfig();
  const [cardExpanded, setCardExpanded] = useState(false);

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setCardExpanded((expanded) => !expanded);
  };

  const customStep =
    variant === 'nft'
      ? (step as LifiStep).includedSteps?.find((step) => step.type === 'custom')
      : undefined;

  const hasCollapsedSteps =
    dense && (step as LifiStep).includedSteps?.length > 1;

  if (customStep && contractTool) {
    const toolDetails = {
      key: contractTool.name,
      name: contractTool.name,
      logoURI: contractTool.logoURI,
    };
    customStep.toolDetails = toolDetails;
    if (dense) {
      (step as LifiStep).toolDetails = toolDetails;
    }
  }

  return (
    <Box {...other}>
      <Box display="flex" alignItems="center">
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <SmallAvatar>
              <LiFiToolLogo />
            </SmallAvatar>
          }
        >
          <StepAvatar
            variant="circular"
            src={step.toolDetails.logoURI}
            alt={step.toolDetails.name}
          >
            {step.toolDetails.name[0]}
          </StepAvatar>
        </Badge>
        <Typography ml={2} fontSize={18} fontWeight="500" flex={1}>
          {t(`swap.stepDetails`, {
            tool: step.toolDetails.name,
          })}
        </Typography>
        {hasCollapsedSteps ? (
          <CardIconButton onClick={handleExpand} size="small">
            {cardExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </CardIconButton>
        ) : null}
      </Box>
      {hasCollapsedSteps ? (
        <Collapse timeout={225} in={cardExpanded} mountOnEnter unmountOnExit>
          <IncludedSteps step={step} variant={variant} />
        </Collapse>
      ) : (
        <IncludedSteps step={step} variant={variant} />
      )}
    </Box>
  );
};

export const IncludedSteps: React.FC<{
  step: Step;
  variant?: WidgetVariant;
}> = ({ step, variant }) => {
  // eslint-disable-next-line react/no-unstable-nested-components
  const StepIconComponent = ({ icon }: StepIconProps) => {
    const tool = (step as LifiStep).includedSteps?.[Number(icon) - 1];

    return tool ? (
      <SmallAvatar
        src={tool.toolDetails.logoURI}
        alt={tool.toolDetails.name}
        sx={{
          boxSizing: 'content-box',
        }}
      >
        {tool.toolDetails.name[0]}
      </SmallAvatar>
    ) : null;
  };
  const StepDetailsLabel =
    step.tool === 'custom' && variant === 'nft'
      ? CustomStepDetailsLabel
      : step.type === 'cross' ||
        (step.type === 'lifi' &&
          step.includedSteps.some((step) => step.type === 'cross'))
      ? CrossStepDetailsLabel
      : SwapStepDetailsLabel;
  return (step as LifiStep).includedSteps.length > 1 ? (
    <Box mt={1.5}>
      <Stepper
        orientation="vertical"
        connector={<StepConnector />}
        activeStep={-1}
      >
        {(step as LifiStep).includedSteps.map((step, i) => (
          <MuiStep key={step.id} expanded>
            <StepLabel StepIconComponent={StepIconComponent}>
              {step.type === 'custom' && variant === 'nft' ? (
                <CustomStepDetailsLabel step={step} variant={variant} />
              ) : step.type === 'cross' || step.type === 'lifi' ? (
                <CrossStepDetailsLabel step={step} />
              ) : step.type === 'protocol' ? (
                <ProtocolStepDetailsLabel step={step} />
              ) : (
                <SwapStepDetailsLabel step={step} />
              )}
            </StepLabel>
            <StepContent>
              <StepDetailsContent step={step} variant={variant} />
            </StepContent>
          </MuiStep>
        ))}
      </Stepper>
    </Box>
  ) : (
    <Box ml={6}>
      <StepDetailsLabel
        step={step}
        variant={variant === 'nft' ? variant : undefined}
      />
      <StepDetailsContent step={step} variant={variant} />
    </Box>
  );
};

export const StepDetailsContent: React.FC<{
  step: Step;
  variant?: WidgetVariant;
}> = ({ step, variant }) => {
  const { t } = useTranslation();

  const sameTokenProtocolStep =
    step.action.fromToken.chainId === step.action.toToken.chainId &&
    step.action.fromToken.address === step.action.toToken.address;

  let fromAmount;
  if (sameTokenProtocolStep) {
    fromAmount = Big(step.estimate.fromAmount)
      .div(10 ** step.action.fromToken.decimals)
      .minus(
        Big(step.estimate.toAmount).div(10 ** step.action.toToken.decimals),
      );
  } else {
    fromAmount = formatTokenAmount(
      step.estimate.fromAmount,
      step.action.fromToken.decimals,
    );
  }

  const showToAmount =
    step.type !== 'custom' &&
    step.tool !== 'custom' &&
    variant !== 'nft' &&
    !sameTokenProtocolStep;

  return (
    <Typography
      fontSize={12}
      fontWeight="500"
      color="text.secondary"
      alignItems="center"
      display="flex"
    >
      {t('format.number', {
        value: fromAmount,
      })}{' '}
      {step.action.fromToken.symbol}
      {showToAmount ? (
        <>
          <ArrowForwardIcon sx={{ fontSize: 18, paddingX: 0.5 }} />
          {t('format.number', {
            value: formatTokenAmount(
              step.execution?.toAmount ?? step.estimate.toAmount,
              step.execution?.toToken?.decimals ?? step.action.toToken.decimals,
            ),
          })}{' '}
          {step.execution?.toToken?.symbol ?? step.action.toToken.symbol}
        </>
      ) : null}
    </Typography>
  );
};

export const CustomStepDetailsLabel: React.FC<StepDetailsLabelProps> = ({
  step,
  variant,
}) => {
  const { t } = useTranslation();

  if (!variant) {
    return null;
  }

  return (
    <Typography fontSize={12} fontWeight="500" color="text.secondary">
      {t(`swap.${variant}StepDetails`, {
        tool: step.toolDetails.name,
      })}
    </Typography>
  );
};

export const CrossStepDetailsLabel: React.FC<
  Omit<StepDetailsLabelProps, 'variant'>
> = ({ step }) => {
  const { t } = useTranslation();
  const { getChainById } = useChains();
  return (
    <Typography fontSize={12} fontWeight="500" color="text.secondary">
      {t('swap.crossStepDetails', {
        from: getChainById(step.action.fromChainId)?.name,
        to: getChainById(step.action.toChainId)?.name,
        tool: step.toolDetails.name,
      })}
    </Typography>
  );
};

export const SwapStepDetailsLabel: React.FC<
  Omit<StepDetailsLabelProps, 'variant'>
> = ({ step }) => {
  const { t } = useTranslation();
  const { getChainById } = useChains();
  return (
    <Typography fontSize={12} fontWeight="500" color="text.secondary">
      {t('swap.swapStepDetails', {
        chain: getChainById(step.action.fromChainId)?.name,
        tool: step.toolDetails.name,
      })}
    </Typography>
  );
};

export const ProtocolStepDetailsLabel: React.FC<
  Omit<StepDetailsLabelProps, 'variant'>
> = ({ step }) => {
  const { t } = useTranslation();
  return (
    <Typography fontSize={12} fontWeight="500" color="text.secondary">
      {step.toolDetails.key === 'lifuelProtocol'
        ? t('swap.refuelStepDetails', {
            tool: step.toolDetails.name,
          })
        : step.toolDetails.name}
    </Typography>
  );
};
