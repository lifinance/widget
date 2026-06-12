import type { CardProps } from '@mui/material'
import type { ChangeEvent, JSX } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToken } from '../../hooks/useToken.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useInputModeStore } from '../../stores/inputMode/useInputModeStore.js'
import {
  formatInputAmount,
  formatTokenPrice,
  priceToTokenAmount,
  usdDecimals,
} from '../../utils/format.js'
import { fitInputText } from '../../utils/input.js'
import { CardTitle } from '../Card/CardTitle.js'
import { TokenPillButton } from '../TokenPillButton/TokenPillButton.js'
import {
  AmountCard,
  CardBodyRow,
  CardFooterRow,
  CardHeaderRow,
  LargeInput,
  maxInputFontSize,
  minInputFontSize,
} from './AmountInputCard.style.js'
import { BalanceDisplay } from './BalanceDisplay.js'
import { FiatValueToggle } from './FiatValueToggle.js'
import { PercentageChips } from './PercentageChips.js'

export const SendAmountCard: React.FC<CardProps> = (props): JSX.Element => {
  const { t } = useTranslation()
  const { disabledUI } = useWidgetConfig()
  const ref = useRef<HTMLInputElement>(null)
  const isEditingRef = useRef(false)
  const [formattedPriceInput, setFormattedPriceInput] = useState('')

  const formType = 'from' as const

  const [chainId, tokenAddress, value] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType),
    FormKeyHelper.getAmountKey(formType)
  )

  const { token } = useToken(chainId, tokenAddress)
  const { setFieldValue } = useFieldActions()
  const { inputMode } = useInputModeStore()
  const currentInputMode = inputMode[formType]
  const disabled = disabledUI?.fromAmount

  let displayValue: string
  if (isEditingRef.current) {
    if (currentInputMode === 'price') {
      displayValue = formattedPriceInput
    } else {
      displayValue = value as string
    }
  } else {
    if (currentInputMode === 'price') {
      const priceValue = formatTokenPrice(value as string, token?.priceUSD)
      displayValue = formatInputAmount(
        priceValue.toFixed(usdDecimals),
        usdDecimals
      )
    } else {
      displayValue = value as string
    }
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { value: inputValue } = event.target
    isEditingRef.current = true

    if (currentInputMode === 'price') {
      const cleanInputValue = inputValue.replace('$', '')
      const formattedValue = formatInputAmount(
        cleanInputValue,
        usdDecimals,
        true
      )
      const tokenValue = priceToTokenAmount(formattedValue, token?.priceUSD)
      setFormattedPriceInput(formattedValue)
      setFieldValue('fromAmount', tokenValue, {
        isDirty: true,
        isTouched: true,
      })
    } else {
      const formattedValue = formatInputAmount(
        inputValue,
        token?.decimals,
        true
      )
      setFieldValue('fromAmount', formattedValue, {
        isDirty: true,
        isTouched: true,
      })
    }
  }

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { value: inputValue } = event.target
    isEditingRef.current = false

    if (currentInputMode === 'price') {
      const cleanInputValue = inputValue.replace('$', '')
      const formattedValue = formatInputAmount(cleanInputValue, usdDecimals)
      const tokenValue = priceToTokenAmount(formattedValue, token?.priceUSD)
      const formattedAmount = formatInputAmount(tokenValue, token?.decimals)
      setFieldValue('fromAmount', formattedAmount, {
        isDirty: true,
        isTouched: true,
      })
    } else {
      const formattedValue = formatInputAmount(inputValue, token?.decimals)
      setFieldValue('fromAmount', formattedValue, {
        isDirty: true,
        isTouched: true,
      })
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect must run on value change
  useLayoutEffect(() => {
    if (ref.current) {
      fitInputText(maxInputFontSize, minInputFontSize, ref.current)
    }
  }, [displayValue])

  return (
    <AmountCard {...props}>
      <CardHeaderRow>
        <CardTitle sx={{ padding: 0 }}>{t('header.send')}</CardTitle>
        <PercentageChips formType={formType} />
      </CardHeaderRow>
      <CardBodyRow>
        <LargeInput
          inputRef={ref}
          size="small"
          autoComplete="off"
          placeholder={currentInputMode === 'price' ? '$0' : '0'}
          inputProps={{ inputMode: 'decimal' }}
          onChange={handleChange}
          onBlur={handleBlur}
          value={
            currentInputMode === 'price'
              ? displayValue
                ? `$${displayValue}`
                : ''
              : displayValue
          }
          name="fromAmount"
          disabled={disabled}
          required
        />
        <TokenPillButton formType={formType} />
      </CardBodyRow>
      <CardFooterRow>
        <FiatValueToggle formType={formType} />
        <BalanceDisplay formType={formType} />
      </CardFooterRow>
    </AmountCard>
  )
}
