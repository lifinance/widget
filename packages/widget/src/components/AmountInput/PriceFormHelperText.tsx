import type { TokenAmount } from '@lifi/sdk'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { Skeleton } from '@mui/material'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTokenAddressBalance } from '../../hooks/useTokenAddressBalance.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useInputModeStore } from '../../stores/inputMode/useInputModeStore.js'
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js'
import {
  BalanceText,
  DescriptionRow,
  DescriptionText,
} from './AmountInput.style.js'
import { InputPriceButton } from './PriceFormHelperText.style.js'

export const PriceFormHelperText = memo<FormTypeProps>(({ formType }) => {
  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType)
  )
  const { token, isLoading } = useTokenAddressBalance(chainId, tokenAddress)

  return (
    <PriceFormHelperTextBase
      formType={formType}
      isLoading={isLoading}
      tokenAddress={tokenAddress}
      token={token}
    />
  )
})

const PriceFormHelperTextBase: React.FC<
  FormTypeProps & {
    isLoading?: boolean
    tokenAddress?: string
    token?: TokenAmount
  }
> = ({ formType, isLoading, tokenAddress, token }) => {
  const { t } = useTranslation()
  const [amount] = useFieldValues(FormKeyHelper.getAmountKey(formType))
  const { inputMode, toggleInputMode } = useInputModeStore()

  const currentInputMode = inputMode[formType]

  const tokenAmount = token
    ? formatTokenAmount(token.amount, token.decimals)
    : '0'

  const getPriceAmountDisplayValue = () => {
    if (currentInputMode === 'amount') {
      const tokenPrice = formatTokenPrice(
        amount,
        token?.priceUSD,
        token?.decimals
      )
      return t('format.currency', { value: tokenPrice })
    }
    return t('format.tokenAmount', { value: amount || '0' })
  }

  const handleToggleMode = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleInputMode(formType)
  }

  return (
    <DescriptionRow>
      <InputPriceButton
        onClick={token?.priceUSD ? handleToggleMode : undefined}
      >
        <DescriptionText>{getPriceAmountDisplayValue()}</DescriptionText>
        {currentInputMode === 'price' && token?.symbol ? (
          <DescriptionText sx={{ ml: 0.25 }}>{token.symbol}</DescriptionText>
        ) : null}
        {token?.priceUSD ? (
          <SwapVertIcon
            sx={{ fontSize: 14, ml: 0.25, color: 'text.secondary' }}
          />
        ) : null}
      </InputPriceButton>
      {isLoading && tokenAddress ? (
        <Skeleton variant="text" width={56} height={16} />
      ) : token?.amount ? (
        <BalanceText title={tokenAmount}>
          {`/ ${t('format.tokenAmount', { value: tokenAmount })}`}
        </BalanceText>
      ) : null}
    </DescriptionRow>
  )
}
