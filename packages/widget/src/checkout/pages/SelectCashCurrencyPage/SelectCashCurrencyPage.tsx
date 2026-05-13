import { Avatar, Box, List, ListItemAvatar, ListItemText } from '@mui/material'
import { type ChangeEvent, type JSX, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ListItemButton } from '../../../components/ListItem/ListItemButton.js'
import { PageContainer } from '../../../components/PageContainer.js'
import { SearchInput } from '../../../components/Search/SearchInput.js'
import { useHeader } from '../../../hooks/useHeader.js'
import { useCheckoutNavigate } from '../../hooks/useCheckoutNavigate.js'
import {
  FIAT_CURRENCIES,
  type FiatCurrency,
  useFiatCurrencyStore,
} from '../../stores/useFiatCurrencyStore.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'

const FIAT_CURRENCY_FLAGS: Record<FiatCurrency, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
}

export const SelectCashCurrencyPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useCheckoutNavigate()
  const setCurrency = useFiatCurrencyStore((s) => s.setCurrency)
  const [search, setSearch] = useState('')

  useHeader(t('header.currency'))

  const handleSelect = (currency: FiatCurrency): void => {
    setCurrency(currency)
    navigate({ to: checkoutNavigationRoutes.enterAmount })
  }

  const normalizedSearch = search.trim().toLowerCase()
  const filtered = FIAT_CURRENCIES.filter((c) => {
    if (!normalizedSearch) {
      return true
    }
    const description = t(`checkout.fiatCurrency.${c}`).toLowerCase()
    return (
      c.toLowerCase().includes(normalizedSearch) ||
      description.includes(normalizedSearch)
    )
  })

  return (
    <PageContainer bottomGutters>
      <Box sx={{ py: 1 }}>
        <SearchInput
          name="fiatCurrencySearch"
          value={search}
          placeholder={t('main.searchCurrency')}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          onClear={() => setSearch('')}
        />
      </Box>
      <List disablePadding>
        {filtered.map((c) => (
          <ListItemButton
            key={c}
            dense
            onClick={() => handleSelect(c)}
            sx={{ height: 60, marginBottom: '4px' }}
          >
            <ListItemAvatar>
              <Avatar sx={{ fontSize: 28, bgcolor: 'transparent' }}>
                {FIAT_CURRENCY_FLAGS[c]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={c}
              secondary={t(`checkout.fiatCurrency.${c}`)}
              slotProps={{ primary: { sx: { fontWeight: 700 } } }}
            />
          </ListItemButton>
        ))}
      </List>
    </PageContainer>
  )
}
