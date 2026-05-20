import type { TokenAmount } from '@lifi/sdk'
import type { FormTypeProps } from '@lifi/widget/shared'
import {
  FormKeyHelper,
  formatTokenAmount,
  formatTokenPrice,
  InputPriceButton,
  useFieldValues,
  useInputModeStore,
  useToken,
  useTokenAddressBalance,
} from '@lifi/widget/shared'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { FormHelperText, Skeleton, Typography } from '@mui/material'
import type React from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsWalletFundedFlow } from '../hooks/useIsWalletFundedFlow.js'
import { formatCheckoutBalanceWithToken } from '../utils/formatCheckoutBalance.js'

export const CheckoutPriceFormHelperText: React.NamedExoticComponent<FormTypeProps> =
  memo<FormTypeProps>(({ formType }) => {
    const { t } = useTranslation()
    const [chainId, tokenAddress, amount] = useFieldValues(
      FormKeyHelper.getChainKey(formType),
      FormKeyHelper.getTokenKey(formType),
      FormKeyHelper.getAmountKey(formType)
    )
    const { inputMode, toggleInputMode } = useInputModeStore()
    const isWalletFunded = useIsWalletFundedFlow()

    // Only fetch the connected-wallet balance when the funding source actually
    // uses it. Passing undefined gates the RPC call inside the hook.
    const { token: walletToken, isLoading: walletBalanceLoading } =
      useTokenAddressBalance(
        isWalletFunded ? chainId : undefined,
        isWalletFunded ? tokenAddress : undefined
      )
    const { token: lookupToken } = useToken(chainId, tokenAddress)

    const token: TokenAmount | undefined = isWalletFunded
      ? walletToken
      : (lookupToken as TokenAmount | undefined)
    const isBalanceLoading = isWalletFunded && walletBalanceLoading
    const currentInputMode = inputMode[formType]
    const canTogglePrice = isWalletFunded && Boolean(token?.priceUSD)

    const priceOrAmountLabel = (() => {
      if (currentInputMode === 'amount') {
        const tokenPrice = formatTokenPrice(
          amount,
          token?.priceUSD,
          token?.decimals
        )
        return t('format.currency', { value: tokenPrice })
      }
      return t('format.tokenAmount', { value: amount || '0' })
    })()

    const handleToggleMode = (e: React.MouseEvent) => {
      e.stopPropagation()
      toggleInputMode(formType)
    }

    const balanceFormatted = token
      ? t('format.tokenAmount', {
          value: formatTokenAmount(token.amount, token.decimals),
        })
      : '0'

    return (
      <FormHelperText
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 0,
        }}
      >
        <InputPriceButton
          onClick={canTogglePrice ? handleToggleMode : undefined}
        >
          {canTogglePrice ? <SwapVertIcon sx={{ fontSize: 14 }} /> : null}
          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: 12,
              lineHeight: 1,
              marginRight: 0.25,
              maxWidth: 136,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {priceOrAmountLabel}
          </Typography>
          {currentInputMode === 'price' && token?.symbol ? (
            <Typography
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: 12,
                lineHeight: 1,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                marginRight: 0.25,
              }}
            >
              {token.symbol}
            </Typography>
          ) : null}
        </InputPriceButton>
        {isWalletFunded ? (
          isBalanceLoading && tokenAddress ? (
            <Skeleton variant="text" width={140} height={16} sx={{ ml: 0.5 }} />
          ) : token?.amount ? (
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 12,
                color: 'text.secondary',
                lineHeight: 1,
                paddingLeft: 0.25,
                textAlign: 'right',
                flexShrink: 0,
              }}
              title={balanceFormatted}
            >
              {token.symbol
                ? formatCheckoutBalanceWithToken(balanceFormatted, token.symbol)
                : `/ ${balanceFormatted}`}
            </Typography>
          ) : null
        ) : null}
      </FormHelperText>
    )
  })
