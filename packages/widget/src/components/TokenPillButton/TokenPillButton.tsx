import { useNavigate } from '@tanstack/react-router'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useChain } from '../../hooks/useChain.js'
import { useToken } from '../../hooks/useToken.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import type { DisabledUIConfig } from '../../types/widget.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { AvatarBadgedDefault } from '../Avatar/Avatar.js'
import { TokenAvatar } from '../Avatar/TokenAvatar.js'
import {
  TokenPill,
  TokenPillLabel,
  TokenPillSymbol,
  TokenSelectPill,
} from './TokenPillButton.style.js'

export const TokenPillButton: React.FC<FormTypeProps> = ({
  formType,
}): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { disabledUI, mode } = useWidgetConfig()

  const tokenKey = FormKeyHelper.getTokenKey(formType)
  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    tokenKey
  )

  const { chain } = useChain(chainId)
  const { token } = useToken(chainId, tokenAddress)

  const isSelected = !!(chain && token)

  const handleClick = (): void => {
    navigate({
      to:
        formType === 'from'
          ? navigationRoutes.fromToken
          : mode === 'refuel'
            ? navigationRoutes.toTokenNative
            : navigationRoutes.toToken,
    })
  }

  const isDisabled = !!disabledUI?.[tokenKey as keyof DisabledUIConfig]

  if (isSelected) {
    return (
      <TokenPill
        onClick={isDisabled ? undefined : handleClick}
        disabled={isDisabled}
      >
        <TokenAvatar
          token={token}
          chain={chain}
          tokenAvatarSize={24}
          chainAvatarSize={12}
        />
        <TokenPillSymbol>{token.symbol}</TokenPillSymbol>
      </TokenPill>
    )
  }

  return (
    <TokenSelectPill
      variant="contained"
      onClick={isDisabled ? undefined : handleClick}
    >
      <AvatarBadgedDefault avatarSize={24} badgeSize={12} />
      <TokenPillLabel>{t('main.select')}</TokenPillLabel>
    </TokenSelectPill>
  )
}
