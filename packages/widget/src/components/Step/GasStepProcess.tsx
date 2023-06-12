import type { LifiStep } from '@lifi/sdk';
import EvStationIcon from '@mui/icons-material/EvStation';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CircularIcon } from './CircularProgress.style';

export const GasStepProcess: React.FC<{
  step: LifiStep;
}> = ({ step }) => {
  const { t } = useTranslation();
  const isDone = step.execution?.status === 'DONE';
  return (
    <Box px={2} py={1}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CircularIcon status={isDone ? 'DONE' : 'NOT_STARTED'}>
          <EvStationIcon
            color={isDone ? 'success' : 'inherit'}
            sx={{
              position: 'absolute',
              fontSize: '1rem',
            }}
          />
        </CircularIcon>
        <Typography ml={2} flex={1} fontSize={14} fontWeight={400}>
          {t('format.currency', {
            value:
              (step.execution?.gasAmountUSD ||
                step.estimate.gasCosts?.reduce(
                  (amount, gasCost) =>
                    amount + parseFloat(gasCost.amountUSD || '0'),
                  0,
                )) ??
              0,
          })}{' '}
          {isDone ? t('main.gasFeePaid') : t('main.gasFeeEstimated')}
        </Typography>
      </Box>
    </Box>
  );
};
