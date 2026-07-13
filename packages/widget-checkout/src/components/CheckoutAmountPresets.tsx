import {
  FormKeyHelper,
  useFieldActions,
  useFieldValues,
} from '@lifi/widget/shared'
import { Chip, Stack } from '@mui/material'
import type { JSX } from 'react'
import { useFiatCurrencyStore } from '../stores/useFiatCurrencyStore.js'
import { normalizeFiatAmount } from '../utils/fiatFormat.js'

const PRESET_AMOUNTS = [20, 50, 100, 200] as const

export const CheckoutAmountPresets: React.FC = (): JSX.Element => {
  const currency = useFiatCurrencyStore((s) => s.currency)
  const [cashFiatAmount] = useFieldValues('cashFiatAmount')
  const { setFieldValue } = useFieldActions()

  const selected = Number.parseFloat(normalizeFiatAmount(cashFiatAmount))
  const setPresetAmount = (amount: number) => {
    setFieldValue('cashFiatAmount', String(amount), {
      isDirty: true,
      isTouched: true,
    })
    setFieldValue(FormKeyHelper.getAmountKey('from'), '', {
      isDirty: true,
      isTouched: true,
    })
  }

  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'nowrap' }}>
      {PRESET_AMOUNTS.map((amount) => {
        const isSelected = selected === amount
        return (
          <Chip
            key={amount}
            size="small"
            label={`${amount} ${currency}`}
            onClick={() => setPresetAmount(amount)}
            sx={{
              height: 'auto',
              fontSize: 13,
              fontWeight: 600,
              bgcolor: isSelected ? 'primary.main' : 'action.hover',
              color: isSelected ? 'primary.contrastText' : 'text.primary',
              border: 'none',
              '& .MuiChip-label': {
                px: 1.5,
                py: 1,
              },
              '&:hover': {
                bgcolor: isSelected ? 'primary.main' : 'action.selected',
              },
            }}
          />
        )
      })}
    </Stack>
  )
}
