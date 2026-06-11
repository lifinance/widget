import SwapVertIcon from '@mui/icons-material/SwapVert'
import { ButtonBase, styled } from '@mui/material'
import type React from 'react'
import { type JSX, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useToken } from '../../hooks/useToken.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useInputModeStore } from '../../stores/inputMode/useInputModeStore.js'
import { formatTokenPrice } from '../../utils/format.js'
import { FooterText } from './AmountInputCard.style.js'

const ToggleButton: React.FC<
  React.ComponentProps<typeof ButtonBase> & { clickable?: boolean }
> = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'clickable',
})<{ clickable?: boolean }>(({ theme, clickable }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  borderRadius: `calc(${theme.vars.shape.borderRadius} * 2)`,
  padding: theme.spacing(0.25, 0.5),
  backgroundColor: 'transparent',
  ...(clickable
    ? {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
        },
      }
    : {
        cursor: 'default',
        pointerEvents: 'none',
      }),
}))

export const FiatValueToggle: React.NamedExoticComponent<FormTypeProps> = memo(
  ({ formType }: FormTypeProps): JSX.Element => {
    const { t } = useTranslation()
    const [chainId, tokenAddress, amount] = useFieldValues(
      FormKeyHelper.getChainKey(formType),
      FormKeyHelper.getTokenKey(formType),
      FormKeyHelper.getAmountKey(formType)
    )

    const { token } = useToken(chainId, tokenAddress)
    const { inputMode, toggleInputMode } = useInputModeStore()
    const currentInputMode = inputMode[formType]

    const handleToggle = (e: React.MouseEvent): void => {
      e.stopPropagation()
      toggleInputMode(formType)
    }

    const canToggle = !!token?.priceUSD

    const displayValue =
      currentInputMode === 'amount'
        ? t('format.currency', {
            value: formatTokenPrice(amount, token?.priceUSD, token?.decimals),
          })
        : t('format.tokenAmount', { value: amount || '0' })

    return (
      <ToggleButton
        clickable={canToggle}
        onClick={canToggle ? handleToggle : undefined}
      >
        <FooterText>{displayValue}</FooterText>
        {currentInputMode === 'price' && token?.symbol ? (
          <FooterText>{token.symbol}</FooterText>
        ) : null}
        {canToggle ? (
          <SwapVertIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
        ) : null}
      </ToggleButton>
    )
  }
)
