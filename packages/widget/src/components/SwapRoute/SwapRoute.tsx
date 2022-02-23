import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSwapRoutes } from '../../hooks/useSwapRoutes';
import { SwapStepper } from '../SwapStepper';

export const SwapRoute: React.FC = () => {
  const { t } = useTranslation();
  const { routes, isFetching, isFetched } = useSwapRoutes();

  return (
    <Box py={2}>
      <SwapStepper
        steps={[
          { label: 'CAKE', sublabel: 'on BSC' },
          { label: 'Anyswap', sublabel: 'bridge' },
          { label: 'Solana', sublabel: 'bridge' },
          { label: 'AAVE', sublabel: 'on Polygon' },
        ]}
      />
      <Box
        mt={2}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ alignSelf: 'end' }}
        >
          {t(`swap.gas`)}
        </Typography>
        <Typography
          ml={2}
          variant="subtitle1"
          color="text.primary"
          sx={{ alignSelf: 'end' }}
        >
          {t(`swap.price`, { price: 20 })}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ alignSelf: 'end' }}
        >
          {t(`swap.waitingTime`)}
        </Typography>
        <Typography
          ml={2}
          variant="subtitle1"
          color="text.primary"
          sx={{ alignSelf: 'end' }}
        >
          20 min
        </Typography>
      </Box>
    </Box>
  );
};
