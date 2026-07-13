import { RouteNotFoundCard } from '@lifi/widget/shared'
import Route from '@mui/icons-material/Route'
import { Box, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutFlowStore } from '../stores/useCheckoutFlowStore.js'

export const CheckoutRouteNotFound: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)

  // Only the intent-factory-only sources get the checkout-specific copy.
  if (!fundingSource || fundingSource === 'wallet') {
    return <RouteNotFoundCard />
  }

  return (
    <Box
      sx={{
        py: 1.625,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1,
        whiteSpace: 'normal',
      }}
    >
      <Typography sx={{ fontSize: 48 }}>
        <Route fontSize="inherit" />
      </Typography>
      <Typography sx={{ fontSize: 18, fontWeight: 700, textAlign: 'center' }}>
        {t('checkout.routeNotFound.title')}
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          color: 'text.secondary',
          textAlign: 'center',
          mt: 2,
        }}
      >
        {t('checkout.routeNotFound.description')}
      </Typography>
    </Box>
  )
}
