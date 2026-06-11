import { formatUnits } from '@lifi/sdk'
import { Box, ButtonBase, styled } from '@mui/material'
import type React from 'react'
import { type JSX, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useGasRecommendation } from '../../hooks/useGasRecommendation.js'
import { useTokenAddressBalance } from '../../hooks/useTokenAddressBalance.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'

const ChipContainer: React.FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(0.5),
  })
)

const Chip: React.FC<React.ComponentProps<typeof ButtonBase>> = styled(
  ButtonBase
)(({ theme }) => ({
  height: 20,
  padding: theme.spacing(0.5, 1),
  fontSize: 10,
  fontWeight: 700,
  lineHeight: '14px',
  borderRadius: theme.shape.borderRadiusSecondary,
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  color: theme.vars.palette.text.primary,
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
  },
}))

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
