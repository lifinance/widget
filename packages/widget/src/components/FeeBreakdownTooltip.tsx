import type { Route } from '@lifi/sdk';
import { Box, Tooltip, Typography } from '@mui/material';
import type { TFunction } from 'i18next';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { formatUnits } from 'viem';
import type { FeesBreakdown } from '../utils/fees.js';
import { getFeeCostsBreakdown, getGasCostsBreakdown } from '../utils/fees.js';

export interface FeeBreakdownTooltipProps {
  route: Route;
  gasCosts?: FeesBreakdown[];
  feeCosts?: FeesBreakdown[];
  children: ReactElement<any, any>;
}

export const FeeBreakdownTooltip: React.FC<FeeBreakdownTooltipProps> = ({
  route,
  gasCosts,
  feeCosts,
  children,
}) => {
  const { t } = useTranslation();
  const _gasCosts = gasCosts ?? getGasCostsBreakdown(route);
  const _feeCosts = feeCosts ?? getFeeCostsBreakdown(route, false);
  return (
    <Tooltip
      title={
        <Box>
          {_gasCosts.length ? (
            <Box>
              {t('main.fees.network')}
              {getFeeBreakdownTypography(_gasCosts, t)}
            </Box>
          ) : null}
          {_feeCosts.length ? (
            <Box mt={0.5}>
              {t('main.fees.provider')}
              {getFeeBreakdownTypography(_feeCosts, t)}
            </Box>
          ) : null}
        </Box>
      }
      sx={{ cursor: 'help' }}
    >
      {children}
    </Tooltip>
  );
};

export const getFeeBreakdownTypography = (
  fees: FeesBreakdown[],
  t: TFunction,
) =>
  fees.map((fee, index) => (
    <Typography
      fontSize={12}
      fontWeight="500"
      color="inherit"
      key={`${fee.token.address}${index}`}
    >
      {t(`format.currency`, { value: fee.amountUSD })} (
      {parseFloat(formatUnits(fee.amount, fee.token.decimals))?.toFixed(9)}{' '}
      {fee.token.symbol})
    </Typography>
  ));
