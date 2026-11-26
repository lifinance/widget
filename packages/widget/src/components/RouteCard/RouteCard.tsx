import type { TokenAmount } from '@lifi/sdk'
import { isGaslessStep } from '@lifi/sdk'
import { Box, Tooltip } from '@mui/material'
import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import type { RouteLabel } from '../../types/widget.js'
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
  sx,
  ...other
}) => {
  const { t } = useTranslation()
  const { mode, modeOptions, routeLabels, hiddenUI } = useWidgetConfig()
  const labelId = useId()
  const selectable = variant !== 'cardless' && Boolean(other.onClick)

  const token: TokenAmount =
    mode === 'custom' && modeOptions?.custom?.type !== 'deposit'
      ? { ...route.fromToken, amount: BigInt(route.fromAmount) }
      : { ...route.toToken, amount: BigInt(route.toAmount) }
  const impactToken: TokenAmount | undefined =
    mode !== 'custom' && !hiddenUI?.routeCardPriceImpact
      ? { ...route.fromToken, amount: BigInt(route.fromAmount) }
      : undefined

  const [tags, customLabels]: [string[], RouteLabel[]] = useMemo(() => {
    const mainTag = route.tags?.find(
      (tag) => tag === 'CHEAPEST' || tag === 'FASTEST'
    )
    const tags: string[] = mainTag ? [mainTag] : []
    const { combinedFeesUSD } = getAccumulatedFeeCostsBreakdown(route)
    if (!combinedFeesUSD || route.steps.every(isGaslessStep)) {
      tags.push('gasless')
    }
    if (route.steps.length > 1) {
      tags.push('multistep')
    }
    const customLabels = getMatchingLabels(route, routeLabels)
    return [tags, customLabels]
    // oxlint-disable-next-line react/exhaustive-deps -- `route.tags` also triggers a recompute when the same `route` object gets new tags
  }, [route.tags, route, routeLabels])

  const cardContent = (
    <Box
      sx={{
        flex: 1,
      }}
    >
      {mode !== 'refuel' && (tags.length || customLabels.length) ? (
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
        labelId={labelId}
      />
    </Box>
  )

  // Only the cardless variant drops the card: the card carries `onClick`, so a
  // bare quote in a list could not be selected.
  return variant === 'cardless' ? (
    cardContent
  ) : (
    <Card
      type={active ? 'selected' : 'default'}
      selectionColor="secondary"
      indented
      sx={[
        selectable ? { position: 'relative' } : {},
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {selectable ? (
        // Keyboard access to `onClick`: the card holds its own buttons (expand,
        // rate), so it cannot be a button itself. This native button covers the
        // card but lets the pointer through; Enter and Space on it fire a click
        // that bubbles to the card. Named by the token row only: the tags would
        // match other buttons, and the tooltip targets in the essentials row
        // carry an `aria-label` that replaces their values in the name.
        <Box
          component="button"
          type="button"
          aria-labelledby={labelId}
          sx={(theme) => ({
            position: 'absolute',
            inset: 0,
            m: 0,
            p: 0,
            border: 0,
            borderRadius: 'inherit',
            background: 'transparent',
            pointerEvents: 'none',
            '&:focus-visible': {
              outline: `2px solid ${theme.vars.palette.primary.main}`,
              outlineOffset: -2,
            },
          })}
        />
      ) : null}
      {cardContent}
    </Card>
  )
}
