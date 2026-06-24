import { Box, Stack, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutNavigate } from '../hooks/useCheckoutNavigate.js'
import { useFiatCurrencyStore } from '../stores/useFiatCurrencyStore.js'
import { getCurrencyName } from '../utils/fiatFormat.js'
import { checkoutNavigationRoutes } from '../utils/navigationRoutes.js'

export const FiatCurrencyChip: React.FC = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const navigate = useCheckoutNavigate()
  const currency = useFiatCurrencyStore((s) => s.currency)
  const currencyName = getCurrencyName(currency, i18n.language)

  const handleClick = (): void => {
    navigate({ to: checkoutNavigationRoutes.selectCash })
  }

  return (
    <Box
      component="button"
      type="button"
      onClick={handleClick}
      sx={{
        border: 0,
        bgcolor: 'transparent',
        p: 0,
        m: 0,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        textAlign: 'left',
      }}
      aria-label={t('checkout.fiatCurrency.label')}
    >
      <Stack>
        <Typography
          variant="body2"
          sx={{
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.1,
            color: 'text.secondary',
          }}
        >
          {t('checkout.fiatCurrency.label')}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: 14, fontWeight: 700, lineHeight: '20px' }}
        >
          {currency} · {currencyName}
        </Typography>
      </Stack>
    </Box>
  )
}
