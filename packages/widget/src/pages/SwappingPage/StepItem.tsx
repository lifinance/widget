/* eslint-disable react/no-array-index-key */
import { Step, TokenAmount } from '@lifinance/sdk';
import { Avatar, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CardContainer, CardTitle } from '../../components/Card';
import { formatTokenAmount } from '../../utils/format';
import { ExecutionItem } from './ExecutionItem';
import { StepTimer } from './StepTimer';

export const StepItem: React.FC<{
  step: Step;
  fromToken?: TokenAmount;
  toToken?: TokenAmount;
}> = ({ step, fromToken, toToken }) => {
  const { t } = useTranslation();

  return (
    <CardContainer>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
        }}
      >
        <CardTitle flex={1}>Swap</CardTitle>
        <CardTitle>
          <StepTimer
            expiryTimestamp={
              new Date(Date.now() + step.estimate.executionDuration * 1000)
            }
          />
        </CardTitle>
      </Box>
      {fromToken ? (
        <Box
          px={2}
          pt={2}
          pb={1}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Avatar
            src={fromToken.logoURI}
            alt={fromToken.symbol}
            sx={{ marginRight: 2 }}
          >
            {fromToken.symbol[0]}
          </Avatar>
          <Typography fontSize={24} fontWeight="700" lineHeight={1.333334}>
            {formatTokenAmount(fromToken.amount, fromToken.decimals)}
          </Typography>
          <Typography
            fontSize={18}
            fontWeight="500"
            alignSelf="flex-end"
            color="text.secondary"
            mx={1}
          >
            {fromToken.symbol}
          </Typography>
        </Box>
      ) : null}
      {step.execution?.process.map((process, index) => (
        <ExecutionItem key={index} process={process} />
      ))}
      {toToken ? (
        <Box
          px={2}
          pt={1}
          pb={2}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Avatar
            src={toToken.logoURI}
            alt={toToken.symbol}
            sx={{ marginRight: 2 }}
          >
            {toToken.symbol[0]}
          </Avatar>
          <Typography fontSize={24} fontWeight="700" lineHeight={1.333334}>
            {formatTokenAmount(toToken.amount, toToken.decimals)}
          </Typography>
          <Typography
            fontSize={18}
            fontWeight="500"
            alignSelf="flex-end"
            color="text.secondary"
            mx={1}
          >
            {toToken.symbol}
          </Typography>
        </Box>
      ) : null}
    </CardContainer>
  );
};
