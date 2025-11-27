import { Skeleton } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useChain } from '../../hooks/useChain'
import { useSwapOnly } from '../../hooks/useSwapOnly'
import { useToken } from '../../hooks/useToken'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import type { FormTypeProps } from '../../stores/form/types'
import { FormKeyHelper } from '../../stores/form/types'
import { useFieldValues } from '../../stores/form/useFieldValues'
import { HiddenUI } from '../../types/widget'
import { navigationRoutes } from '../../utils/navigationRoutes'
import { AvatarBadgedDefault, AvatarBadgedSkeleton } from '../Avatar/Avatar'
import { TokenAvatar } from '../Avatar/TokenAvatar'
import { CardTitle } from '../Card/CardTitle'
import {
  CardContent,
  SelectTokenCard,
  SelectTokenCardHeader,
} from './SelectTokenButton.style'

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
