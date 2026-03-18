import type { TokenAmount } from '@lifi/sdk'
import { Box, Tooltip } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { HiddenUI, type RouteLabel } from '../../types/widget.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import type { CardProps } from '../Card/Card.js'
import { Card } from '../Card/Card.js'
import { CardLabel, CardLabelTypography } from '../Card/CardLabel.js'
import { getMatchingLabels } from './getMatchingLabels.js'
import { RouteToken } from './RouteToken.js'
import type { RouteCardProps } from './types.js'

export const RouteCard: React.FC<
  RouteCardProps & Omit<CardProps, 'variant'>
> = ({
  route,
  active,
  variant = 'default',
  expanded: defaultExpanded,
  ...other
}) => {
  const { t } = useTranslation()
  const { subvariant, subvariantOptions, routeLabels, hiddenUI } =
    useWidgetConfig()

  const token: TokenAmount =
    subvariant === 'custom' && subvariantOptions?.custom !== 'deposit'
      ? { ...route.fromToken, amount: BigInt(route.fromAmount) }
      : { ...route.toToken, amount: BigInt(route.toAmount) }
  const impactToken: TokenAmount | undefined =
    subvariant !== 'custom' &&
    !hiddenUI?.includes(HiddenUI.RouteCardPriceImpact)
      ? { ...route.fromToken, amount: BigInt(route.fromAmount) }
      : undefined

  const [tags, customLabels]: [string[], RouteLabel[]] = useMemo(() => {
    const mainTag = route.tags?.find(
      (tag) => tag === 'CHEAPEST' || tag === 'FASTEST'
    )
    const tags: string[] = mainTag ? [mainTag] : []
    const { combinedFeesUSD } = getAccumulatedFeeCostsBreakdown(route)
    if (!combinedFeesUSD) {
      tags.push('gasless')
    }
    if (route.steps.length > 1) {
      tags.push('multistep')
    }
    const customLabels = getMatchingLabels(route, routeLabels)
    return [tags, customLabels]
  }, [route.tags, route, routeLabels])

  const cardContent = (
    <Box
      sx={{
        flex: 1,
      }}
    >
      {subvariant !== 'refuel' && (tags.length || customLabels.length) ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {tags?.map((tag) => {
            const formattedTag = tag.toLowerCase()
            const tooltipKey = `tooltip.${formattedTag}` as any
            const tooltipText = t(tooltipKey)
            const hasTooltip = tooltipText !== tooltipKey

            const cardLabel = (
              <CardLabel
                variant={
                  tag === 'gasless'
                    ? 'success'
                    : active
                      ? 'secondary'
                      : undefined
                }
                key={tag}
              >
                <CardLabelTypography>
                  {t(`main.tags.${formattedTag}` as any)}
                </CardLabelTypography>
              </CardLabel>
            )

            return hasTooltip ? (
              <Tooltip key={tag} title={tooltipText} arrow placement="top">
                {cardLabel}
              </Tooltip>
            ) : (
              cardLabel
            )
          })}
          {customLabels.map((label, index) => (
            <CardLabel key={index} sx={label.sx}>
              <CardLabelTypography>{label.text}</CardLabelTypography>
            </CardLabel>
          ))}
        </Box>
      ) : null}
      <RouteToken
        route={route}
        token={token}
        impactToken={impactToken}
        defaultExpanded={defaultExpanded}
        showEssentials
      />
    </Box>
  )

  return subvariant === 'refuel' || variant === 'cardless' ? (
    cardContent
  ) : (
    <Card
      type={active ? 'selected' : 'default'}
      selectionColor="secondary"
      indented
      {...other}
    >
      {cardContent}
    </Card>
  )
}
