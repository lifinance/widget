import { Warning as WarningIcon } from '@mui/icons-material';
import { Box, BoxProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGasSufficiency } from '../../hooks';
import { CardTitle } from '../Card';
import { MessageCard } from './GasSufficiencyMessage.style';

export const GasSufficiencyMessage: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const { insufficientFunds, insufficientGas } = useGasSufficiency();

  if (!insufficientFunds || !insufficientGas.length) {
    return null;
  }

  let title;
  let message;
  if (insufficientFunds) {
    message = t(`swap.warning.message.insufficientFunds`);
  }
  if (insufficientGas.length) {
    title = t(`swap.warning.title.insufficientGas`);
    message = t(`swap.warning.message.insufficientGas`);
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
        <Typography
          variant="body2"
          px={2}
          pb={insufficientGas.length ? 0 : 2}
          pt={title ? 1 : 2}
        >
          {message}
        </Typography>
        {insufficientGas.length
          ? insufficientGas.map((item, index) => (
              <Typography
                variant="body2"
                px={2}
                pb={insufficientGas.length - 1 === index ? 2 : 0}
                pt={0.5}
              >
                {t(`swap.gasAmount`, {
                  amount: item.insufficientAmount?.toString(),
                  tokenSymbol: item.token.symbol,
                  chainName: item.chain?.name,
                })}
              </Typography>
            ))
          : null}
      </Box>
    </MessageCard>
  );
};
