import { Warning as WarningIcon } from '@mui/icons-material';
import { Box, BoxProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CardTitle } from '../../components/Card';
import { useHasSufficientBalance } from '../../hooks';
import { MessageCard } from './InsufficientGasOrFundsMessage.style';

export const InsufficientGasOrFundsMessage: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const { hasGasOnStartChain, hasGasOnCrossChain, hasSufficientBalance } =
    useHasSufficientBalance();

  if (hasSufficientBalance && hasGasOnStartChain && hasGasOnCrossChain) {
    return null;
  }

  let title;
  let message;
  if (!hasSufficientBalance) {
    message = t(`swap.warning.message.insufficientFunds`);
  }
  if (!hasGasOnStartChain) {
    title = t(`swap.warning.title.insufficientGas`);
    message = t(`swap.warning.message.insufficientGasOnStartChain`);
  }
  if (!hasGasOnCrossChain) {
    title = t(`swap.warning.title.insufficientGas`);
    message = t(`swap.warning.message.insufficientGasOnDestinationChain`);
  }
  return (
    <MessageCard {...props}>
      <WarningIcon
        sx={{
          marginTop: 2,
          marginLeft: 2,
        }}
      />
      <Box>
        {title ? <CardTitle>{title}</CardTitle> : null}
        <Typography variant="body2" px={2} pb={2} pt={title ? 1 : 2}>
          {message}
        </Typography>
      </Box>
    </MessageCard>
  );
};
