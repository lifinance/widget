import { Avatar, Box, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import {
  formatFiat,
  getCurrencyName,
  getCurrencySymbol,
} from '../utils/fiatFormat.js'

interface CheckoutFiatOriginTokenProps {
  currency: string
  amount: string
}

export const CheckoutFiatOriginToken: React.FC<
  CheckoutFiatOriginTokenProps
> = ({ currency, amount }): JSX.Element => {
  const { i18n } = useTranslation()

  return (
    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
      <Avatar
        sx={{
          width: 40,
          height: 40,
          mr: 2,
          fontSize: 18,
          fontWeight: 700,
          bgcolor: 'action.hover',
          color: 'text.primary',
        }}
      >
        {getCurrencySymbol(currency, i18n.language)}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          noWrap
          sx={{ fontSize: 24, fontWeight: 700, lineHeight: 1, mb: 0.5 }}
          title={amount}
        >
          {formatFiat(amount, currency, i18n.language)}
        </Typography>
        <Typography
          noWrap
          sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary' }}
        >
          {getCurrencyName(currency, i18n.language)}
        </Typography>
      </Box>
    </Box>
  )
}
