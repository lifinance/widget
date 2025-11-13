import { Skeleton } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useChain } from '../../hooks/useChain.js'
import { useSwapOnly } from '../../hooks/useSwapOnly.js'
import { useToken } from '../../hooks/useToken.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { HiddenUI } from '../../types/widget.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { AvatarBadgedDefault, AvatarBadgedSkeleton } from '../Avatar/Avatar.js'
import { TokenAvatar } from '../Avatar/TokenAvatar.js'
import { CardTitle } from '../Card/CardTitle.js'
import {
  CardContent,
  SelectTokenCard,
  SelectTokenCardHeader,
} from './SelectTokenButton.style.js'

export const SelectTokenButton: React.FC<
  FormTypeProps & {
    compact: boolean
    hiddenReverse?: boolean
  }
> = ({ formType, compact, hiddenReverse }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { disabledUI, subvariant, hiddenUI } = useWidgetConfig()
  const swapOnly = useSwapOnly()
  const tokenKey = FormKeyHelper.getTokenKey(formType)
  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    tokenKey
  )
  const { chain, isLoading: isChainLoading } = useChain(chainId)
  const { token, isLoading: isTokenLoading } = useToken(chainId, tokenAddress)

  const handleClick = () => {
    navigate({
      to:
        formType === 'from'
          ? navigationRoutes.fromToken
          : subvariant === 'refuel'
            ? navigationRoutes.toTokenNative
            : navigationRoutes.toToken,
    })
  }

  const isSelected = !!(chain && token)
  const onClick = !disabledUI?.includes(tokenKey) ? handleClick : undefined
  const defaultPlaceholder =
    formType === 'to' && subvariant === 'refuel'
      ? t('main.selectChain')
      : (formType === 'to' && swapOnly) ||
          hiddenUI?.includes(HiddenUI.ChainSelect)
        ? t('main.selectToken')
        : t('main.selectChainAndToken')
  const cardTitle: string =
    formType === 'from' && subvariant === 'custom'
      ? t('header.payWith')
      : t(`main.${formType}`)
  return (
    <SelectTokenCard component="button" onClick={onClick}>
      <CardContent formType={formType} compact={compact} mask={!hiddenReverse}>
        <CardTitle>{cardTitle}</CardTitle>
        {chainId && tokenAddress && (isChainLoading || isTokenLoading) ? (
          <SelectTokenCardHeader
            avatar={<AvatarBadgedSkeleton />}
            title={<Skeleton variant="text" width={64} height={24} />}
            subheader={<Skeleton variant="text" width={72} height={16} />}
            compact={compact}
          />
        ) : (
          <SelectTokenCardHeader
            avatar={
              isSelected ? (
                <TokenAvatar token={token} chain={chain} />
              ) : (
                <AvatarBadgedDefault />
              )
            }
            title={isSelected ? token.symbol : defaultPlaceholder}
            slotProps={{
              title: {
                title: isSelected ? token.symbol : defaultPlaceholder,
              },
              subheader: {
                title: isSelected ? chain.name : undefined,
              },
            }}
            subheader={isSelected ? chain.name : null}
            selected={isSelected}
            compact={compact}
          />
        )}
      </CardContent>
    </SelectTokenCard>
  )
}
