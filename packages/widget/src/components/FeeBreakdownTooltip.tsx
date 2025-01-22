import { Box, Tooltip, Typography } from '@mui/material'
import type { TFunction } from 'i18next'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import type { FeesBreakdown } from '../utils/fees.js'
import { formatTokenAmount } from '../utils/format.js'

export interface FeeBreakdownTooltipProps {
  gasCosts?: FeesBreakdown[]
  feeCosts?: FeesBreakdown[]
  children: ReactElement<any, any>
}

export const FeeBreakdownTooltip: React.FC<FeeBreakdownTooltipProps> = ({
  gasCosts,
  feeCosts,
  children,
}) => {
  const { t } = useTranslation()
  return (
    <Tooltip
      title={
        <Box>
          {gasCosts?.length ? (
            <Box>
              {t('main.fees.network')}
              {getFeeBreakdownTypography(gasCosts, t)}
            </Box>
          ) : null}
          {feeCosts?.length ? (
            <Box
              sx={{
                mt: 0.5,
              }}
            >
              {t('main.fees.provider')}
              {getFeeBreakdownTypography(feeCosts, t)}
            </Box>
          ) : null}
        </Box>
      }
      sx={{ cursor: 'help' }}
    >
      {children}
    </Tooltip>
  )
}

export const getFeeBreakdownTypography = (
  fees: FeesBreakdown[],
  t: TFunction
) =>
  fees.map((fee, index) => (
    <Typography
      color="inherit"
      key={`${fee.token.address}${index}`}
      sx={{
        fontSize: 12,
        fontWeight: '500',
      }}
    >
      {t('format.currency', { value: fee.amountUSD })} (
      {t('format.tokenAmount', {
        value: formatTokenAmount(fee.amount, fee.token.decimals),
      })}{' '}
      {fee.token.symbol})
    </Typography>
  ))
