import type { LiFiStepExtended } from '@lifi/sdk';
import { MonetizationOn } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { formatUnits } from 'viem';
import { getStepFeeCostsBreakdown } from '../../utils/fees.js';
import { IconTypography } from './StepActions.style.js';

export const StepFeeBreakdown: React.FC<{
  step: LiFiStepExtended;
}> = ({ step }) => {
  const { t } = useTranslation();

  let fees = 0;
  const feeComponents: ReactNode[] = [];
  const isDone = step.execution?.status === 'DONE';

  const gasCosts = step.execution?.gasCosts ?? step.estimate.gasCosts;
  const feeCosts = step.execution?.feeCosts ?? step.estimate.feeCosts;

  if (gasCosts) {
    const { token, amount, amountUSD } = getStepFeeCostsBreakdown(gasCosts);
    const formattedGasAmount = token
      ? parseFloat(formatUnits(amount, token.decimals))?.toFixed(9)
      : 0;
    fees += amountUSD;
    feeComponents.push(
      <Box ml={7} key="network">
        <Typography
          fontSize={12}
          lineHeight={2}
          color="text.secondary"
          fontWeight="500"
        >
          {isDone
            ? t('main.fees.networkPaid')
            : t('main.fees.networkEstimated')}
        </Typography>
        <Typography
          fontSize={12}
          lineHeight={1}
          fontWeight="500"
          color="text.secondary"
        >
          {t(`format.currency`, { value: amountUSD })} ({formattedGasAmount}{' '}
          {token.symbol})
        </Typography>
      </Box>,
    );
  }

  if (feeCosts) {
    const filteredfeeCosts = feeCosts?.filter((fee) => !fee.included);
    if (filteredfeeCosts?.length) {
      const { token, amount, amountUSD } =
        getStepFeeCostsBreakdown(filteredfeeCosts);
      const formattedFeeAmount = token
        ? parseFloat(formatUnits(amount, token.decimals))?.toFixed(9)
        : 0;
      fees += amountUSD;
      feeComponents.push(
        <Box mt={feeComponents.length ? 0.5 : 0} ml={7} key="bridge">
          <Typography
            fontSize={12}
            lineHeight={2}
            color="text.secondary"
            fontWeight="500"
          >
            {isDone
              ? t('main.fees.providerPaid')
              : t('main.fees.providerEstimated')}
          </Typography>
          <Typography
            fontSize={12}
            lineHeight={1}
            fontWeight="500"
            color="text.secondary"
          >
            {t(`format.currency`, { value: amountUSD })} ({formattedFeeAmount}{' '}
            {token.symbol})
          </Typography>
        </Box>,
      );
    }
  }

  return (
    <Box mt={1.5}>
      <Box display="flex" alignItems="center">
        <IconTypography ml={1} mr={3} height={24}>
          <MonetizationOn />
        </IconTypography>
        <Typography
          fontSize={16}
          color="text.primary"
          fontWeight="600"
          lineHeight={1.125}
        >
          {t(`format.currency`, {
            value: fees,
          })}
        </Typography>
      </Box>
      {feeComponents}
    </Box>
  );
};
