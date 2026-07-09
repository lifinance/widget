import type { Route } from '@lifi/sdk'
import LocalGasStationRounded from '@mui/icons-material/LocalGasStationRounded'
import { Box, Skeleton, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import { SmallAvatar } from '../Avatar/SmallAvatar.js'
import type { CardProps } from '../Card/Card.js'
import { Card } from '../Card/Card.js'
import { IconTypography } from '../IconTypography.js'

interface RouteProviderCardProps {
  route: Route
  active?: boolean
}

export const RouteProviderCard: React.FC<
  RouteProviderCardProps & Omit<CardProps, 'variant'>
> = ({ route, active, onClick, ...other }) => {
  const { t } = useTranslation()

  const provider = route.steps[0]?.toolDetails
  const { gasCostUSD } = getAccumulatedFeeCostsBreakdown(route)

  return (
    <Card
      type={active ? 'selected' : 'default'}
      selectionColor="secondary"
      onClick={onClick}
      sx={{ py: 1.5, px: 2, ...(onClick ? { cursor: 'pointer' } : {}) }}
      {...other}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: 0,
          }}
        >
          <SmallAvatar src={provider?.logoURI} alt={provider?.name} size={20}>
            {provider?.name?.[0]}
          </SmallAvatar>
          <Typography
            noWrap
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {provider?.name}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconTypography component="span" sx={{ mr: 0.5, fontSize: 16 }}>
            <LocalGasStationRounded fontSize="inherit" />
          </IconTypography>
          <Typography
            data-value={gasCostUSD}
            sx={{
              fontSize: 14,
              color: 'text.primary',
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {!gasCostUSD
              ? t('main.fees.free')
              : t('format.currency', {
                  value: gasCostUSD,
                })}
          </Typography>
        </Box>
      </Box>
    </Card>
  )
}

export const RouteProviderCardSkeleton: React.FC<Omit<CardProps, 'variant'>> = (
  props
) => {
  return (
    <Card sx={{ py: 1.5, px: 2 }} {...props}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width={80} height={20} />
        </Box>
        <Skeleton variant="text" width={56} height={20} />
      </Box>
    </Card>
  )
}
