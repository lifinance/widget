/* eslint-disable react/no-array-index-key */
import { Step, TokenAmount } from '@lifinance/sdk';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CardContainer, CardTitle } from '../../components/Card';
import { StepActions } from '../../components/StepActions';
import { ExecutionItem } from './ExecutionItem';
import { StepTimer } from './StepTimer';
import { StepToken } from './StepToken';

export const StepItem: React.FC<{
  step: Step;
  fromToken?: TokenAmount;
  toToken?: TokenAmount;
}> = ({ step, fromToken, toToken }) => {
  const { t } = useTranslation();

  const stepHasError = step.execution?.process.some(
    (process) => process.status === 'FAILED',
  );

  const getCardTitle = () => {
    switch (step.type) {
      case 'lifi':
        return t('swap.stepSwapAndBridge');
      case 'swap':
        return t('swap.stepSwap');
      case 'cross':
        return t('swap.stepBridge');
      default:
        return t('swap.stepSwap');
    }
  };

  return (
    <CardContainer isError={stepHasError}>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
        }}
      >
        <CardTitle flex={1}>{getCardTitle()}</CardTitle>
        <CardTitle>
          <StepTimer step={step} />
        </CardTitle>
      </Box>
      <Box py={1}>
        {fromToken ? <StepToken token={fromToken} px={2} py={1} /> : null}
        <StepActions step={step} px={2} py={1} dense />
        {step.execution?.process.map((process, index) => (
          <ExecutionItem key={index} step={step} process={process} />
        ))}
        {toToken ? <StepToken token={toToken} px={2} py={1} /> : null}
      </Box>
    </CardContainer>
  );
};
