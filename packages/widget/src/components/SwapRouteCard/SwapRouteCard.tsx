import type { BoxProps } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card } from '../Card';
import { StepActions } from '../StepActions';
import { Token } from '../Token';
import { Label } from './SwapRouteCard.style';
import type { SwapRouteCardProps } from './types';

export const SwapRouteCard: React.FC<SwapRouteCardProps & BoxProps> = ({
  route,
  active,
  dense,
  ...other
}) => {
  const { t } = useTranslation();
  const alternativeTag = t(`swap.tags.ALTERNATIVE`);
  const label = route.tags?.length
    ? t(`swap.tags.${route.tags[0]}` as any)
    : alternativeTag;
  return (
    <Card dense={dense} indented {...other}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        mb={2}
      >
        <Label active={active ?? label !== alternativeTag}>{label}</Label>
      </Box>
      <Token token={{ ...route.toToken, amount: route.toAmount }} mb={2} />
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
          <Typography fontSize={18} fontWeight="500" lineHeight={1} pt={0.25}>
            {t(`swap.currency`, { value: route.gasCostUSD ?? 0 })}
          </Typography>
          <Typography
            fontSize={12}
            color="text.secondary"
            lineHeight={1}
            mt={0.5}
          >
            {t(`swap.gas`)}
          </Typography>
        </Box>
        <Box>
          <Typography
            fontSize={18}
            fontWeight="500"
            display="flex"
            justifyContent="flex-end"
            lineHeight={1}
            pt={0.25}
          >
            ~
            {(
              route.steps
                .map((step) => step.estimate.executionDuration)
                .reduce((duration, x) => duration + x) / 60
            ).toFixed(0)}
          </Typography>
          <Typography
            fontSize={12}
            color="text.secondary"
            textAlign="end"
            lineHeight={1}
            mt={0.5}
          >
            {t(`swap.minutes`)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
