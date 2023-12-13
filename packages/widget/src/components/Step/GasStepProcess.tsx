import type { LiFiStepExtended } from '@lifi/sdk';
// import EvStationIcon from '@mui/icons-material/EvStation';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Box, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CircularIcon } from './CircularProgress.style';

export const GasStepProcess: React.FC<{
  step: LiFiStepExtended;
}> = ({ step }) => {
  const { t } = useTranslation();
  const isDone = step.execution?.status === 'DONE';
  return (
    <Box px={2} py={1}>
      <Tooltip
        title={
          <Box component="span">
            <Typography fontSize={12} fontWeight="500">
              {t(`tooltip.estimatedNetworkFee`)}
            </Typography>
            <Typography fontSize={12} fontWeight="500">
              $0.50 (0.512345678 MATIC)
            </Typography>
            <Box mt={0.5}>
              <Typography fontSize={12} fontWeight="500">
                {t(`tooltip.additionalProviderFee`)}
              </Typography>
              <Typography fontSize={12} fontWeight="500">
                $1.50 (1.512345678 MATIC)
              </Typography>
            </Box>
          </Box>
        }
        placement="top"
        enterDelay={400}
        arrow
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CircularIcon status={isDone ? 'DONE' : 'NOT_STARTED'}>
            <MonetizationOnIcon
              color={isDone ? 'success' : 'inherit'}
              sx={{
                position: 'absolute',
                fontSize: '1rem',
              }}
            />
          </CircularIcon>
          <Typography ml={2} flex={1} fontSize={14} fontWeight={400}>
            {/* {t('format.currency', {
            value:
              (step.execution?.gasAmountUSD ||
                step.estimate.gasCosts?.reduce(
                  (amount, gasCost) =>
                    amount + parseFloat(gasCost.amountUSD || '0'),
                  0,
                )) ??
              0,
          })}{' '} */}
            {/* {isDone ? t('main.gasFeePaid') : t('main.gasFeeEstimated')} */}
            $2.00 estimated fees
          </Typography>
        </Box>
      </Tooltip>
      <Box ml={6}>
        <Typography fontSize={12} fontWeight="500" color="text.secondary">
          {t(`tooltip.estimatedNetworkFee`)}
        </Typography>
        <Typography fontSize={12} fontWeight="500" color="text.secondary">
          $0.50 (0.512345678 MATIC)
        </Typography>
        <Box mt={0.5}>
          <Typography fontSize={12} fontWeight="500" color="text.secondary">
            {t(`tooltip.additionalProviderFee`)}
          </Typography>
          <Typography fontSize={12} fontWeight="500" color="text.secondary">
            $1.50 (1.512345678 MATIC)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
