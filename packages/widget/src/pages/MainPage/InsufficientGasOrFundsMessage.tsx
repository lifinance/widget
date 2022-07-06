import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CardTitle } from '../../components/Card';
import { useHasSufficientBalance } from '../../hooks';
import { MessageCard } from './InsufficientGasOrFundsMessage.style';

export const InsufficientGasOrFundsMessage: React.FC = () => {
  const { t } = useTranslation();
  const {
    hasGasBalanceOnStartChain,
    hasGasOnCrossChain,
    hasSufficientBalance,
  } = useHasSufficientBalance();

  if (hasSufficientBalance && hasGasBalanceOnStartChain && hasGasOnCrossChain) {
    return null;
  }

  let title;
  let message;
  if (!hasSufficientBalance) {
    title = t(`swap.warning.title.insufficientFunds`);
    message = t(`swap.warning.message.insufficientFunds`);
  }
  if (!hasGasBalanceOnStartChain) {
    title = t(`swap.warning.title.insufficientGasOnStartChain`);
    message = t(`swap.warning.message.insufficientGasOnStartChain`);
  }
  if (!hasGasOnCrossChain) {
    title = t(`swap.warning.title.insufficientGasOnDestinationChain`);
    message = t(`swap.warning.message.insufficientGasOnDestinationChain`);
  }
  return (
    <MessageCard mx={3} mb={3}>
      <CardTitle>{title}</CardTitle>
      <Typography variant="body2" px={2} pb={2} pt={1}>
        {message}
      </Typography>
    </MessageCard>
  );
};
