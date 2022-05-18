import { LifiStep, Step } from '@lifinance/sdk';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Step as MuiStep,
  Stepper,
  Typography,
  TypographyProps,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useChains } from '../../hooks';
import LiFiLogo from '../../icons/LiFiLogo.svg';
import { formatTokenAmount } from '../../utils/format';
import {
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
  const isFullView = !dense && (step as LifiStep).includedSteps?.length;
  return (
    <Box {...other}>
      <Box
        sx={{ display: 'flex', alignItems: 'center' }}
        mb={isFullView ? 1 : 0}
      >
        <Avatar
          variant={step.type === 'lifi' ? 'square' : 'circular'}
          src={step.type === 'lifi' ? LiFiLogo : step.toolDetails.logoURI}
          alt={step.toolDetails.name}
        >
          {step.toolDetails.name[0]}
        </Avatar>
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
                <StepDetailsLabel step={step} />
              </StepLabel>
              <StepContent>
                <StepDetailsContent step={step} />
              </StepContent>
            </MuiStep>
          ))}
        </Stepper>
      ) : (
        <>
          <StepDetailsLabel ml={6} step={step} />
          <StepDetailsContent ml={6} step={step} />
        </>
      )}
    </Box>
  );
};

export const StepDetailsContent: React.FC<{ step: Step } & TypographyProps> = ({
  step,
  ...other
}) => {
  return (
    <Typography
      fontSize={12}
      fontWeight="500"
      color="text.secondary"
      alignItems="center"
      display="flex"
      {...other}
    >
      {formatTokenAmount(
        step.estimate.fromAmount,
        step.action.fromToken.decimals,
      )}{' '}
      {step.action.fromToken.symbol}
      <ArrowForwardIcon sx={{ fontSize: '.75rem', paddingX: 0.5 }} />
      {formatTokenAmount(
        step.estimate.toAmount,
        step.action.toToken.decimals,
      )}{' '}
      {step.action.toToken.symbol}
    </Typography>
  );
};

export const CrossStepDetailsLabel: React.FC<
  { step: Step } & TypographyProps
> = ({ step, ...other }) => {
  const { t } = useTranslation();
  const { getChainById } = useChains();

  return (
    <Typography
      fontSize={12}
      fontWeight="500"
      color="text.secondary"
      {...other}
    >
      {t('swapping.crossStepDetails', {
        from: getChainById(step.action.fromChainId)?.name,
        to: getChainById(step.action.toChainId)?.name,
        tool: step.toolDetails.name,
      })}
    </Typography>
  );
};

export const SwapStepDetailsLabel: React.FC<
  { step: Step } & TypographyProps
> = ({ step, ...other }) => {
  const { t } = useTranslation();
  return (
    <Typography
      fontSize={12}
      fontWeight="500"
      color="text.secondary"
      {...other}
    >
      {t('swapping.swapStepDetails', {
        value: step.toolDetails.name,
      })}
    </Typography>
  );
};
