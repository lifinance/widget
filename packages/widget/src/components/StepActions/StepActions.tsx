import { LifiStep, Step } from '@lifi/sdk';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Box, Step as MuiStep, Stepper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useChains } from '../../hooks';
import { formatTokenAmount } from '../../utils';
import { LiFiLogo } from '../LiFiLogo';
import {
  StepAvatar,
  StepConnector,
  StepContent,
  StepIcon,
  StepLabel,
} from './StepActions.style';
import { StepActionsProps } from './types';

export const StepActions: React.FC<StepActionsProps> = ({
  step,
  dense,
  ...other
}) => {
  const StepDetailsLabel =
    step.type === 'cross' || step.type === 'lifi'
      ? CrossStepDetailsLabel
      : SwapStepDetailsLabel;
  const isFullView = !dense && (step as LifiStep).includedSteps?.length > 1;
  return (
    <Box {...other}>
      <Box
        sx={{ display: 'flex', alignItems: 'center' }}
        mb={isFullView ? 1 : 0}
      >
        <StepAvatar
          variant={step.type === 'lifi' ? 'square' : 'circular'}
          src={step.type !== 'lifi' ? step.toolDetails.logoURI : undefined}
          alt={step.toolDetails.name}
        >
          {step.type === 'lifi' ? <LiFiLogo /> : step.toolDetails.name[0]}
        </StepAvatar>
        <Typography
          ml={2}
          fontSize={18}
          fontWeight="500"
          textTransform="capitalize"
        >
          {step.type === 'lifi'
            ? 'LI.FI Smart Contract'
            : step.toolDetails.name}
        </Typography>
      </Box>
      {isFullView ? (
        <Stepper
          orientation="vertical"
          connector={<StepConnector />}
          activeStep={-1}
        >
          {(step as LifiStep).includedSteps.map((step) => (
            <MuiStep key={step.id} expanded>
              <StepLabel StepIconComponent={StepIcon}>
                {step.type === 'cross' || step.type === 'lifi' ? (
                  <CrossStepDetailsLabel step={step} />
                ) : (
                  <SwapStepDetailsLabel step={step} />
                )}
              </StepLabel>
              <StepContent>
                <StepDetailsContent step={step} />
              </StepContent>
            </MuiStep>
          ))}
        </Stepper>
      ) : (
        <Box ml={6}>
          <StepDetailsLabel step={step} />
          <StepDetailsContent step={step} />
        </Box>
      )}
    </Box>
  );
};

export const StepDetailsContent: React.FC<{ step: Step }> = ({ step }) => {
  return (
    <Typography
      fontSize={12}
      fontWeight="500"
      color="text.secondary"
      alignItems="center"
      display="flex"
    >
      {formatTokenAmount(
        step.estimate.fromAmount,
        step.action.fromToken.decimals,
      )}{' '}
      {step.action.fromToken.symbol}
      <ArrowForwardIcon sx={{ fontSize: 18, paddingX: 0.5 }} />
      {formatTokenAmount(
        step.execution?.toAmount ?? step.estimate.toAmount,
        step.action.toToken.decimals,
      )}{' '}
      {step.action.toToken.symbol}
    </Typography>
  );
};

export const CrossStepDetailsLabel: React.FC<{ step: Step }> = ({ step }) => {
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

export const SwapStepDetailsLabel: React.FC<{ step: Step }> = ({ step }) => {
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
