/* eslint-disable react/no-array-index-key */
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Token, TokenDivider } from '../../components/Token';
import { navigationRoutes } from '../../utils';
import type {
  ExtendedTransactionInfo,
  StatusResponse,
  TokenAmount,
} from '@lifi/sdk';
import type { FullStatusData } from '@lifi/sdk';

export const TransactionHistoryItem: React.FC<{
  transaction: StatusResponse;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  size: number;
  start: number;
}> = ({ transaction, size, start, startAdornment, endAdornment }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const sending: ExtendedTransactionInfo =
    transaction.sending as ExtendedTransactionInfo;
  const receiving: ExtendedTransactionInfo =
    transaction.receiving as ExtendedTransactionInfo;

  const handleClick = () => {
    navigate(navigationRoutes.transactionDetails, {
      state: { transactionHistory: transaction as FullStatusData },
    });
  };

  const startedAt = new Date(
    ((sending as ExtendedTransactionInfo).timestamp ?? 0) * 1000,
  );

  if (!sending.token?.chainId || !receiving.token?.chainId) {
    // @eugene how to handle this case?
    return null;
  }

  const fromToken: TokenAmount = {
    ...sending.token,
    amount: sending.amount ?? '0',
    priceUSD: sending.token.priceUSD ?? '0',
    symbol: sending.token?.symbol ?? '',
    decimals: sending.token?.decimals ?? 0,
    name: sending.token?.name ?? '',
    chainId: sending.token?.chainId,
  };

  const toToken: TokenAmount = {
    ...receiving.token,
    amount: receiving.amount ?? '0',
    priceUSD: receiving.token.priceUSD ?? '0',
    symbol: receiving.token?.symbol ?? '',
    decimals: receiving.token?.decimals ?? 0,
    name: receiving.token?.name ?? '',
    chainId: receiving.token?.chainId,
  };

  return (
    <Card
      onClick={handleClick}
      style={{
        height: `${size}px`,
        transform: `translateY(${start}px)`,
      }}
    >
      {startAdornment}
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
      {endAdornment}
    </Card>
  );
};
