import { formatUnits } from '@lifi/sdk'
import { type JSX, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useGasRecommendation } from '../../hooks/useGasRecommendation.js'
import { useTokenAddressBalance } from '../../hooks/useTokenAddressBalance.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { Chip, ChipContainer } from './PercentageChips.style.js'

export const PercentageChips: React.NamedExoticComponent<FormTypeProps> = memo(
  ({ formType }: FormTypeProps): JSX.Element | null => {
    const { t } = useTranslation()
    const { getChainById } = useAvailableChains()
    const { setFieldValue } = useFieldActions()

    const [chainId, tokenAddress] = useFieldValues(
      FormKeyHelper.getChainKey(formType),
      FormKeyHelper.getTokenKey(formType)
    )

    const { data } = useGasRecommendation(chainId)
    const { token } = useTokenAddressBalance(chainId, tokenAddress)

    const getMaxAmount = (): bigint => {
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

    const handlePercentage = (percentage: number): void => {
      const maxAmount = getMaxAmount()
      if (maxAmount && token?.decimals) {
        const percentageAmount = (maxAmount * BigInt(percentage)) / 100n
        setFieldValue(
          FormKeyHelper.getAmountKey(formType),
          formatUnits(percentageAmount, token.decimals),
          { isTouched: true }
        )
      }
    }

    const handleMax = (): void => {
      const maxAmount = getMaxAmount()
      if (maxAmount && token?.decimals) {
        setFieldValue(
          FormKeyHelper.getAmountKey(formType),
          formatUnits(maxAmount, token.decimals),
          { isTouched: true }
        )
      }
    }

    if (formType !== 'from' || !token) {
      return null
    }

    return (
      <ChipContainer>
        <Chip onClick={() => handlePercentage(25)}>25%</Chip>
        <Chip onClick={() => handlePercentage(50)}>50%</Chip>
        <Chip onClick={() => handlePercentage(75)}>75%</Chip>
        <Chip onClick={handleMax}>{t('button.max')}</Chip>
      </ChipContainer>
    )
  }
)
