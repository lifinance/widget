import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import { Box, Skeleton, styled } from '@mui/material'
import type React from 'react'
import { type JSX, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTokenAddressBalance } from '../../hooks/useTokenAddressBalance.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { formatTokenAmount } from '../../utils/format.js'
import { FooterText } from './AmountInputCard.style.js'

const BalanceContainer: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}))

export const BalanceDisplay: React.NamedExoticComponent<FormTypeProps> = memo(
  ({ formType }: FormTypeProps): JSX.Element | null => {
    const { t } = useTranslation()
    const [chainId, tokenAddress] = useFieldValues(
      FormKeyHelper.getChainKey(formType),
      FormKeyHelper.getTokenKey(formType)
    )

    const { token, isLoading } = useTokenAddressBalance(chainId, tokenAddress)

    if (isLoading && tokenAddress) {
      return <Skeleton variant="text" width={72} height={16} />
    }

    if (!token?.amount) {
      return null
    }

    const tokenAmount = formatTokenAmount(token.amount, token.decimals)

    return (
      <BalanceContainer>
        <AccountBalanceWalletOutlinedIcon
          sx={{ fontSize: 16, color: 'text.secondary' }}
        />
        <FooterText title={tokenAmount}>
          {t('format.tokenAmount', { value: tokenAmount })}
        </FooterText>
      </BalanceContainer>
    )
  }
)
