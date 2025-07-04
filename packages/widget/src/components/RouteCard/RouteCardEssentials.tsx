import { isRelayerStep } from '@lifi/sdk'
import AccessTimeFilled from '@mui/icons-material/AccessTimeFilled'
import LocalGasStationRounded from '@mui/icons-material/LocalGasStationRounded'
import { Box, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import { formatDuration } from '../../utils/format.js'
import { FeeBreakdownTooltip } from '../FeeBreakdownTooltip.js'
import { IconTypography } from '../IconTypography.js'
import { TokenRate } from '../TokenRate/TokenRate.js'
import type { RouteCardEssentialsProps } from './types.js'

export const RouteCardEssentials: React.FC<RouteCardEssentialsProps> = ({
  route,
}) => {
  const { t, i18n } = useTranslation()
  const executionTimeSeconds = Math.floor(
    route.steps.reduce(
      (duration, step) => duration + step.estimate.executionDuration,
      0
    )
  )
  const { gasCosts, feeCosts, combinedFeesUSD } =
    getAccumulatedFeeCostsBreakdown(route)
  const hasRelayerSupport = route.steps.every(isRelayerStep)
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        mt: 2,
      }}
    >
      <TokenRate route={route} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FeeBreakdownTooltip
          gasCosts={gasCosts}
          feeCosts={feeCosts}
          relayerSupport={hasRelayerSupport}
        >
          <Box
            sx={{
              display: 'flex',
              mr: 1.5,
              alignItems: 'center',
            }}
          >
            <IconTypography mr={0.5} fontSize={16}>
              <LocalGasStationRounded fontSize="inherit" />
            </IconTypography>
            <Typography
              data-value={hasRelayerSupport ? 0 : combinedFeesUSD}
              sx={{
                fontSize: 14,
                color: 'text.primary',
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {hasRelayerSupport
                ? t('main.fees.free')
                : t('format.currency', {
                    value: combinedFeesUSD,
                  })}
            </Typography>
          </Box>
        </FeeBreakdownTooltip>
        <Tooltip title={t('tooltip.estimatedTime')} sx={{ cursor: 'help' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconTypography mr={0.5} fontSize={16}>
              <AccessTimeFilled fontSize="inherit" />
            </IconTypography>
            <Typography
              sx={{
                fontSize: 14,
                color: 'text.primary',
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {formatDuration(executionTimeSeconds, i18n.language)}
            </Typography>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  )
}
