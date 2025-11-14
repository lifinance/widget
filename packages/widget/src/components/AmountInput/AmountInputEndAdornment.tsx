import { InputAdornment } from '@mui/material'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useGasRecommendation } from '../../hooks/useGasRecommendation.js'
import { useTokenAddressBalance } from '../../hooks/useTokenAddressBalance.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { formatUnits } from '../../utils/format.js'
import { ButtonContainer, MaxButton } from './AmountInputAdornment.style.js'

export const AmountInputEndAdornment = memo(({ formType }: FormTypeProps) => {
  const { t } = useTranslation()
  const { getChainById } = useAvailableChains()
  const { setFieldValue } = useFieldActions()

  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType)
  )

  // We get gas recommendations for the source chain to make sure that after pressing the Max button
  // the user will have enough funds remaining to cover gas costs
  const { data } = useGasRecommendation(chainId)

  const { token } = useTokenAddressBalance(chainId, tokenAddress)

  const getMaxAmount = () => {
    if (!token?.amount) {
      return 0n
    }
    const chain = getChainById(chainId)
    let maxAmount = token.amount
    if (chain?.nativeToken.address === tokenAddress && data?.recommended) {
      const recommendedAmount = BigInt(data.recommended.amount)
      if (token.amount > recommendedAmount) {
        maxAmount = token.amount - recommendedAmount
      }
    }
    return maxAmount
  }

  const handlePercentage = (percentage: number) => {
    const maxAmount = getMaxAmount()
    if (maxAmount && token?.decimals) {
      const percentageAmount = (maxAmount * BigInt(percentage)) / 100n
      setFieldValue(
        FormKeyHelper.getAmountKey(formType),
        formatUnits(percentageAmount, token.decimals),
        {
          isTouched: true,
        }
      )
    }
  }

  const handleMax = () => {
    const maxAmount = getMaxAmount()
    if (maxAmount && token?.decimals) {
      setFieldValue(
        FormKeyHelper.getAmountKey(formType),
        formatUnits(maxAmount, token.decimals),
        {
          isTouched: true,
        }
      )
    }
  }

  return (
    <InputAdornment position="end" sx={{ paddingTop: 2 }}>
      {formType === 'from' && token?.amount ? (
        <ButtonContainer>
          <MaxButton onClick={() => handlePercentage(25)} data-delay="0">
            25%
          </MaxButton>
          <MaxButton onClick={() => handlePercentage(50)} data-delay="1">
            50%
          </MaxButton>
          <MaxButton onClick={() => handlePercentage(75)} data-delay="2">
            75%
          </MaxButton>
          <MaxButton onClick={handleMax} data-delay="3">
            {t('button.max')}
          </MaxButton>
        </ButtonContainer>
      ) : null}
    </InputAdornment>
  )
})
