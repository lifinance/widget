import {
  FormKeyHelper,
  ListItemButton,
  PageContainer,
  SearchInput,
  useFieldActions,
  useHeader,
} from '@lifi/widget/shared'
import type { OnrampFiatCurrency } from '@lifi/widget-provider/checkout'
import {
  Alert,
  Avatar,
  Box,
  Button,
  List,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material'
import { type ChangeEvent, type JSX, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutNavigate } from '../../hooks/useCheckoutNavigate.js'
import { useOnRampFiatCurrencies } from '../../hooks/useOnRampFiatCurrencies.js'
import {
  FIAT_CURRENCIES,
  useFiatCurrencyStore,
} from '../../stores/useFiatCurrencyStore.js'
import { currencyToFlag } from '../../utils/currencyToFlag.js'
import { getCurrencyName } from '../../utils/fiatFormat.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'

export const SelectCashCurrencyPage: React.FC = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const navigate = useCheckoutNavigate()
  const { data, isLoading, isError, refetch } = useOnRampFiatCurrencies()
  const currency = useFiatCurrencyStore((s) => s.currency)
  const setCurrency = useFiatCurrencyStore((s) => s.setCurrency)
  const seedCurrency = useFiatCurrencyStore((s) => s.seedCurrency)
  const paymentMethod = useFiatCurrencyStore((s) => s.paymentMethod)
  const setPaymentMethod = useFiatCurrencyStore((s) => s.setPaymentMethod)
  const { setFieldValue } = useFieldActions()
  const [search, setSearch] = useState('')

  useHeader(t('header.currency'))

  const currencies = useMemo<OnrampFiatCurrency[]>(
    () =>
      data?.currencies?.length
        ? data.currencies
        : FIAT_CURRENCIES.map((item) => ({
            currency: item,
            paymentOptions: [],
          })),
    [data?.currencies]
  )

  useEffect(() => {
    if (data?.defaultCurrency) {
      seedCurrency(data.defaultCurrency)
    }
  }, [data?.defaultCurrency, seedCurrency])

  const selectedCurrency = currencies.find((item) => item.currency === currency)

  useEffect(() => {
    if (selectedCurrency?.paymentOptions.length === 1) {
      setPaymentMethod(selectedCurrency.paymentOptions[0].id)
    }
  }, [selectedCurrency?.paymentOptions, setPaymentMethod])

  const handleSelect = (nextCurrency: string): void => {
    if (nextCurrency !== currency) {
      setFieldValue('cashFiatAmount', '')
      setFieldValue(FormKeyHelper.getAmountKey('from'), '')
      setFieldValue(FormKeyHelper.getAmountKey('to'), '')
    }
    setCurrency(nextCurrency)
    const next = currencies.find((item) => item.currency === nextCurrency)
    if (!next || next.paymentOptions.length <= 1) {
      setPaymentMethod(next?.paymentOptions[0]?.id ?? null)
      navigate({ to: checkoutNavigationRoutes.enterAmount })
    }
  }

  const normalizedSearch = search.trim().toLowerCase()
  const filtered = currencies.filter(({ currency: itemCurrency }) => {
    if (!normalizedSearch) {
      return true
    }
    const description = getCurrencyName(
      itemCurrency,
      i18n.language
    ).toLowerCase()
    return (
      itemCurrency.toLowerCase().includes(normalizedSearch) ||
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
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', p: 1 }}
              >
                <Skeleton variant="circular" width={36} height={36} />
                <Box sx={{ ml: 1, width: '100%' }}>
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="60%" />
                </Box>
              </Box>
            ))
          : null}
        {isError ? (
          <Alert
            severity="error"
            action={
              <Button size="small" onClick={() => void refetch()}>
                {t('button.tryAgain')}
              </Button>
            }
            sx={{ mb: 1 }}
          >
            {t('checkout.cashCurrency.error')}
          </Alert>
        ) : null}
        {!isLoading &&
          filtered.map((c) => (
            <ListItemButton
              key={c.currency}
              dense
              onClick={() => handleSelect(c.currency)}
              sx={{ height: 60, marginBottom: '4px' }}
            >
              <ListItemAvatar>
                <Avatar sx={{ fontSize: 28, bgcolor: 'transparent' }}>
                  {currencyToFlag(c.currency)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={c.currency}
                secondary={getCurrencyName(c.currency, i18n.language)}
                slotProps={{ primary: { sx: { fontWeight: 700 } } }}
              />
            </ListItemButton>
          ))}
      </List>
      {selectedCurrency && selectedCurrency.paymentOptions.length > 1 ? (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ mb: 1, fontSize: 12, color: 'text.secondary' }}>
            {t('checkout.paymentMethod.label')}
          </Typography>
          <List disablePadding>
            {selectedCurrency.paymentOptions.map((option) => (
              <ListItemButton
                key={option.id}
                dense
                selected={paymentMethod === option.id}
                onClick={() => setPaymentMethod(option.id)}
              >
                <ListItemText
                  primary={option.name ?? option.id}
                  secondary={option.id}
                  slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                />
              </ListItemButton>
            ))}
          </List>
          <Button
            fullWidth
            variant="contained"
            disabled={!paymentMethod}
            onClick={() =>
              navigate({ to: checkoutNavigationRoutes.enterAmount })
            }
            sx={{ mt: 2 }}
          >
            {t('button.continue')}
          </Button>
        </Box>
      ) : null}
    </PageContainer>
  )
}
