import { Avatar, Box, BoxProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatTokenAmount } from '../../utils/format';
import { StepActions } from '../StepActions';
import { Card, Label } from './SwapRouteCard.style';
import { SwapRouteCardProps } from './types';

export const SwapRouteCard: React.FC<SwapRouteCardProps & BoxProps> = ({
  route,
  index,
  active,
  dense,
  ...other
}) => {
  const { t } = useTranslation();
  return (
    <Card active={active} {...other}>
      <Box>
        <Label active={active} mb={2}>
          ROUTE {index + 1}
        </Label>
        <Box
          sx={{
            display: 'flex',
          }}
          mb={2}
        >
          <Avatar
            src={route.toToken.logoURI}
            alt={route.toToken.symbol}
            sx={{ marginRight: 2, paddingY: 0.375 }}
          >
            {route.toToken.symbol[0]}
          </Avatar>
          <Box>
            <Typography fontSize={32} fontWeight="bold" lineHeight="normal">
              {formatTokenAmount(route.toAmount, route.toToken.decimals)}
            </Typography>
            <Typography fontSize={14} color="text.secondary">
              {route.toToken.symbol}
            </Typography>
          </Box>
        </Box>
        {!dense
          ? route.steps.map((step) => <StepActions step={step} mb={2} />)
          : null}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography fontSize={18} fontWeight="500">
              {t(`swap.currency`, { value: route.gasCostUSD })}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              {t(`swap.gas`)}
            </Typography>
          </Box>
          <Box>
            <Typography fontSize={18} fontWeight="500">
              ~
              {(
                route.steps
                  .map((step) => step.estimate.executionDuration)
                  .reduce((cumulated, x) => cumulated + x) / 60
              ).toFixed(0)}
            </Typography>
            <Typography fontSize={12} color="text.secondary" textAlign="end">
              {t(`swap.minutes`)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};
