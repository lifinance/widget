/* eslint-disable react/no-array-index-key */
import type { Route } from '@lifi/sdk';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Token, TokenDivider } from '../../components/Token';
import { navigationRoutes } from '../../utils';

export const SwapHistoryItem: React.FC<{
  route: Route;
}> = ({ route }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(navigationRoutes.swapDetails, {
      state: { routeId: route.id },
    });
  };

  const startedAt = new Date(
    route.steps[0].execution?.process[0].startedAt ?? 0,
  );
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
          {new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(
            startedAt,
          )}
        </Typography>
        <Typography fontSize={12}>
          {new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(
            startedAt,
          )}
        </Typography>
      </Box>
      <Box py={1}>
        <Token
          token={{ ...route.fromToken, amount: route.fromAmount }}
          px={2}
          pt={1}
          connected
        />
        <TokenDivider />
        <Token
          token={{
            ...route.toToken,
            amount: route.steps.at(-1)?.execution?.toAmount ?? route.toAmount,
          }}
          px={2}
          pt={0.5}
          pb={1}
        />
      </Box>
    </Card>
  );
};
