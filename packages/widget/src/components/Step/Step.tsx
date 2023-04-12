/* eslint-disable react/no-array-index-key */
import type { LifiStep, TokenAmount } from '@lifi/sdk';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle } from '../../components/Card';
import { StepActions } from '../../components/StepActions';
import { Token } from '../../components/Token';
import { useChains } from '../../hooks';
import { shortenWalletAddress } from '../../utils';
import { DestinationWalletAddress } from './DestinationWalletAddress';
import { GasStepProcess } from './GasStepProcess';
import { StepProcess } from './StepProcess';
import { StepTimer } from './StepTimer';

export const Step: React.FC<{
  step: LifiStep;
  fromToken?: TokenAmount;
  toToken?: TokenAmount;
  toAddress?: string;
}> = ({ step, fromToken, toToken, toAddress }) => {
  const { t } = useTranslation();
  const { getChainById } = useChains();

  const stepHasError = step.execution?.process.some(
    (process) => process.status === 'FAILED',
  );

  const getCardTitle = () => {
    switch (step.type) {
      case 'lifi':
        const hasCrossStep = step.includedSteps.some(
          (step) => step.type === 'cross',
        );
        const hasSwapStep = step.includedSteps.some(
          (step) => step.type === 'swap',
        );
        if (hasCrossStep && hasSwapStep) {
          return t('swap.stepSwapAndBridge');
        }
        if (hasCrossStep) {
          return t('swap.stepBridge');
        }
        return t('swap.stepSwap');
      default:
        return t('swap.stepSwap');
    }
  };

  const formattedToAddress = shortenWalletAddress(toAddress);
  const toAddressLink = toAddress
    ? `${
        getChainById(step.action.toChainId)?.metamask.blockExplorerUrls[0]
      }address/${toAddress}`
    : undefined;

  return (
    <Card variant={stepHasError ? 'error' : 'default'}>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
        }}
      >
        <CardTitle flex={1}>{getCardTitle()}</CardTitle>
        <CardTitle sx={{ fontWeight: 500 }}>
          <StepTimer step={step} />
        </CardTitle>
      </Box>
      <Box py={1}>
        {fromToken ? <Token token={fromToken} px={2} py={1} /> : null}
        <StepActions step={step} px={2} py={1} dense />
        {step.execution?.process.map((process, index) => (
          <StepProcess key={index} step={step} process={process} />
        ))}
        <GasStepProcess step={step} />
        {formattedToAddress && toAddressLink ? (
          <DestinationWalletAddress
            step={step}
            toAddress={formattedToAddress}
            toAddressLink={toAddressLink}
          />
        ) : null}
        {toToken ? <Token token={toToken} px={2} py={1} /> : null}
      </Box>
    </Card>
  );
};
