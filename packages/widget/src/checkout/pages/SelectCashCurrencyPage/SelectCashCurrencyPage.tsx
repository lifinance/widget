import { Card, CardActionArea, Stack, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../../components/PageContainer.js'
import { useHeader } from '../../../hooks/useHeader.js'
import { useCheckoutNavigate } from '../../hooks/useCheckoutNavigate.js'
import {
  FIAT_CURRENCIES,
  type FiatCurrency,
  useFiatCurrencyStore,
} from '../../stores/useFiatCurrencyStore.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'

export const SelectCashCurrencyPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useCheckoutNavigate()
  const setCurrency = useFiatCurrencyStore((s) => s.setCurrency)

  useHeader(t('header.payWith'))

  const handleSelect = (currency: FiatCurrency): void => {
    setCurrency(currency)
    navigate({ to: checkoutNavigationRoutes.enterAmount })
  }

  return (
    <PageContainer topGutters>
      <Stack spacing={1.5}>
        {FIAT_CURRENCIES.map((c) => (
          <Card key={c} elevation={0}>
            <CardActionArea
              onClick={() => handleSelect(c)}
              sx={{ p: 2, display: 'flex', justifyContent: 'flex-start' }}
            >
              <Stack>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {c}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(`checkout.fiatCurrency.${c}`)}
                </Typography>
              </Stack>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </PageContainer>
  )
}
