/* eslint-disable react/no-array-index-key */
import type { Route } from '@lifi/sdk';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Token, TokenDivider } from '../../components/Token';
import { navigationRoutes } from '../../utils';

export const TransactionHistoryItem: React.FC<{
  route: Route;
}> = ({ route }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(navigationRoutes.transactionDetails, {
      state: { routeId: route.id },
    });
  };

  const startedAt = new Date(
    route.steps[0].execution?.process[0].startedAt ?? 0,
  );
  const fromToken = { ...route.fromToken, amount: route.fromAmount };
  const toToken = {
    ...(route.steps.at(-1)?.execution?.toToken ?? route.toToken),
    amount: route.steps.at(-1)?.execution?.toAmount ?? route.toAmount,
  };
  return (
    <Card onClick={handleClick}>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
        }}
        pt={1.75}
        px={2}
      >
        <Typography fontSize={12}>
          {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long' }).format(
            startedAt,
          )}
        </Typography>
        <Typography fontSize={12}>
          {new Intl.DateTimeFormat(i18n.language, {
            timeStyle: 'short',
          }).format(startedAt)}
        </Typography>
      </Box>
      <Box py={1}>
        <Token token={fromToken} px={2} pt={1} connected />
        <TokenDivider />
        <Token token={toToken} px={2} pt={0.5} pb={1} />
      </Box>
    </Card>
  );
};
