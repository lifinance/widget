import AccessTimeFilled from '@mui/icons-material/AccessTimeFilled'
import LocalGasStationRounded from '@mui/icons-material/LocalGasStationRounded'
import { Box, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTokenRateText } from '../../hooks/useTokenRateText.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import { formatDuration } from '../../utils/format.js'
import { FeeBreakdownTooltip } from '../FeeBreakdownTooltip.js'
import { IconTypography } from '../IconTypography.js'
import {
  EssentialsContainer,
  EssentialsIconValueContainer,
  EssentialsRateTypography,
  EssentialsValueTypography,
} from './RouteCardEssentials.style.js'
import type { RouteCardEssentialsProps } from './types.js'

export const RouteCardEssentials: React.FC<RouteCardEssentialsProps> = ({
  route,
  showDuration = true,
}) => {
  const { t, i18n } = useTranslation()
  const { rateText, toggleRate } = useTokenRateText(route)
  const executionTimeSeconds = Math.floor(
    route.steps.reduce(
      (duration, step) => duration + step.estimate.executionDuration,
      0
    )
  )

  const { gasCosts, feeCosts, combinedFeesUSD } =
    getAccumulatedFeeCostsBreakdown(route)
  return (
    <EssentialsContainer>
      <Tooltip title={t('tooltip.exchangeRate')}>
        <EssentialsRateTypography onClick={toggleRate} role="button">
          {rateText}
        </EssentialsRateTypography>
      </Tooltip>
      <Box display="flex" alignItems="center" gap={1}>
        <FeeBreakdownTooltip
          gasCosts={gasCosts}
          feeCosts={feeCosts}
          gasless={!combinedFeesUSD}
        >
          <EssentialsIconValueContainer>
            <IconTypography fontSize={16}>
              <LocalGasStationRounded fontSize="inherit" />
            </IconTypography>
            <EssentialsValueTypography data-value={combinedFeesUSD}>
              {!combinedFeesUSD
                ? t('main.fees.free')
                : t('format.currency', {
                    value: combinedFeesUSD,
                  })}
            </EssentialsValueTypography>
          </EssentialsIconValueContainer>
        </FeeBreakdownTooltip>
        {showDuration && (
          <Tooltip title={t('tooltip.estimatedTime')}>
            <EssentialsIconValueContainer>
              <IconTypography fontSize={16}>
                <AccessTimeFilled fontSize="inherit" />
              </IconTypography>
              <EssentialsValueTypography>
                {formatDuration(executionTimeSeconds, i18n.language)}
              </EssentialsValueTypography>
            </EssentialsIconValueContainer>
          </Tooltip>
        )}
      </Box>
    </EssentialsContainer>
  )
}
