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
import type { WidgetSubvariant } from '../../types';
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
  const { subvariant } = useWidgetConfig();
  const [cardExpanded, setCardExpanded] = useState(false);

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setCardExpanded((expanded) => !expanded);
  };

  const hasCollapsedSteps = dense && step.includedSteps?.length > 1;

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
          badgeContent={
            <SmallAvatar>
              <LiFiToolLogo />
            </SmallAvatar>
          }
        >
          <StepAvatar
            variant="circular"
            src={toolDetails.logoURI}
            alt={toolDetails.name}
          >
            {toolDetails.name[0]}
          </StepAvatar>
        </Badge>
        <Typography ml={2} fontSize={18} fontWeight="500" flex={1}>
          {t(`main.stepDetails`, {
            tool: toolDetails.name,
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
          <IncludedSteps step={step} subvariant={subvariant} />
        </Collapse>
      ) : (
        <IncludedSteps step={step} subvariant={subvariant} />
      )}
    </Box>
  );
};

export const IncludedSteps: React.FC<{
  step: LifiStep;
  subvariant?: WidgetSubvariant;
}> = ({ step, subvariant }) => {
  // eslint-disable-next-line react/no-unstable-nested-components
  const StepIconComponent = ({ icon }: StepIconProps) => {
    const tool = step.includedSteps?.[Number(icon) - 1];

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
    step.tool === 'custom' && subvariant === 'nft'
      ? CustomStepDetailsLabel
      : step.type === 'lifi' &&
        step.includedSteps.some((step) => step.type === 'cross')
      ? CrossStepDetailsLabel
      : SwapStepDetailsLabel;
  return step.includedSteps.length > 1 ? (
    <Box mt={1.5}>
      <Stepper
        orientation="vertical"
        connector={<StepConnector />}
        activeStep={-1}
      >
        {step.includedSteps.map((step, i) => (
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
            <StepContent>
              <StepDetailsContent step={step} subvariant={subvariant} />
            </StepContent>
          </MuiStep>
        ))}
      </Stepper>
    </Box>
  ) : (
    <Box ml={6}>
      <StepDetailsLabel
        step={step as unknown as Step}
        subvariant={subvariant === 'nft' ? subvariant : undefined}
      />
      <StepDetailsContent
        step={step as unknown as Step}
        subvariant={subvariant}
      />
    </Box>
  );
};

export const StepDetailsContent: React.FC<{
  step: Step;
  subvariant?: WidgetSubvariant;
}> = ({ step, subvariant }) => {
  const { t } = useTranslation();

  const sameTokenProtocolStep =
    step.action.fromToken.chainId === step.action.toToken.chainId &&
    step.action.fromToken.address === step.action.toToken.address;

  let fromAmount: string | undefined;
  if (sameTokenProtocolStep) {
    const estimatedFromAmount = Big(step.estimate.fromAmount)
      .div(10 ** step.action.fromToken.decimals)
      .minus(
        Big(step.estimate.toAmount).div(10 ** step.action.toToken.decimals),
      );
    fromAmount = estimatedFromAmount.gt(0)
      ? estimatedFromAmount.toString()
      : Big(step.estimate.fromAmount)
          .div(10 ** step.action.fromToken.decimals)
          .toString();
  } else {
    fromAmount = formatTokenAmount(
      step.estimate.fromAmount,
      step.action.fromToken.decimals,
    );
  }

  const showToAmount =
    step.type !== 'custom' && step.tool !== 'custom' && !sameTokenProtocolStep;

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
  subvariant,
}) => {
  const { t } = useTranslation();

  if (!subvariant) {
    return null;
  }

  // FIXME: step transaction request overrides step tool details, but not included step tool details
  const toolDetails =
    subvariant === 'nft' &&
    (step as unknown as LifiStep).includedSteps?.length > 0
      ? (step as unknown as LifiStep).includedSteps.find(
          (step) => step.tool === 'custom' && step.toolDetails.key !== 'custom',
        )?.toolDetails || step.toolDetails
      : step.toolDetails;

  return (
    <Typography fontSize={12} fontWeight="500" color="text.secondary">
      {t(`main.${subvariant}StepDetails`, {
        tool: toolDetails.name,
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
      {t('main.crossStepDetails', {
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
      {t('main.swapStepDetails', {
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
        ? t('main.refuelStepDetails', {
            tool: step.toolDetails.name,
          })
        : step.toolDetails.name}
    </Typography>
  );
};
