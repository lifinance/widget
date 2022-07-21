import { Check as CheckIcon } from '@mui/icons-material';
import { Box, BoxProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StepActions } from '../StepActions';
import { StepToken } from '../StepToken';
import { Card, Check, Label } from './SwapRouteCard.style';
import { SwapRouteCardProps } from './types';

export const SwapRouteCard: React.FC<SwapRouteCardProps & BoxProps> = ({
  route,
  active,
  dense,
  ...other
}) => {
  const { t } = useTranslation();
  const label = route.tags?.length
    ? t(`swap.tags.${route.tags[0].toLowerCase()}` as any).toUpperCase()
    : t(`swap.tags.general`).toUpperCase();
  return (
    <Card dense={dense} {...other}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          mb={2}
        >
          <Label>{label}</Label>
          {active ? (
            <Check>
              <CheckIcon fontSize="inherit" />
            </Check>
          ) : null}
        </Box>
        <StepToken
          token={{ ...route.toToken, amount: route.toAmount }}
          mb={2}
        />
        {!dense
          ? route.steps.map((step) => (
              <StepActions key={step.id} step={step} mb={2} />
            ))
          : null}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography fontSize={18} fontWeight="500">
              {t(`swap.currency`, { value: route.gasCostUSD ?? 0 })}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              {t(`swap.gas`)}
            </Typography>
          </Box>
          <Box>
            <Typography
              fontSize={18}
              fontWeight="500"
              display="flex"
              justifyContent="flex-end"
            >
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
