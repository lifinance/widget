import type { TokenAmount } from '@lifi/sdk'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Box, Collapse } from '@mui/material'
import type { MouseEventHandler } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { HiddenUI } from '../../types/widget.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import type { CardProps } from '../Card/Card.js'
import { Card } from '../Card/Card.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import { CardLabel, CardLabelTypography } from '../Card/CardLabel.js'
import { StepActions } from '../StepActions/StepActions.js'
import { Token } from '../Token/Token.js'
import { getMatchingLabels } from './getMatchingLabels.js'
import { TokenContainer } from './RouteCard.style.js'
import { RouteCardEssentials } from './RouteCardEssentials.js'
import { RouteCardEssentialsExpanded } from './RouteCardEssentialsExpanded.js'
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
  const [cardExpanded, setCardExpanded] = useState(defaultExpanded)

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    setCardExpanded((expanded) => !expanded)
  }

  const token: TokenAmount =
    subvariant === 'custom' && subvariantOptions?.custom !== 'deposit'
      ? { ...route.fromToken, amount: BigInt(route.fromAmount) }
      : { ...route.toToken, amount: BigInt(route.toAmount) }
  const impactToken: TokenAmount | undefined =
    subvariant !== 'custom'
      ? { ...route.fromToken, amount: BigInt(route.fromAmount) }
      : undefined

  const customLabels = getMatchingLabels(route, routeLabels)
  const mainTag = route.tags?.find(
    (tag) => tag === 'CHEAPEST' || tag === 'FASTEST'
  )
  const tags: string[] = mainTag ? [mainTag] : []
  const { combinedFeesUSD } = getAccumulatedFeeCostsBreakdown(route)
  if (!combinedFeesUSD) {
    tags.push('GASLESS')
  }

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
          {tags?.map((tag) => (
            <CardLabel
              variant={
                tag === 'GASLESS' ? 'success' : active ? 'secondary' : undefined
              }
              key={tag}
            >
              <CardLabelTypography>
                {t(`main.tags.${tag.toLowerCase()}` as any)}
              </CardLabelTypography>
            </CardLabel>
          ))}
          {customLabels.map((label, index) => (
            <CardLabel key={index} sx={label.sx}>
              <CardLabelTypography>{label.text}</CardLabelTypography>
            </CardLabel>
          ))}
        </Box>
      ) : null}
      <TokenContainer>
        <Token
          token={token}
          impactToken={impactToken}
          step={route.steps[0]}
          stepVisible={!cardExpanded}
          disableDescription={hiddenUI?.includes(
            HiddenUI.RouteTokenDescription
          )}
        />
        {!defaultExpanded ? (
          <CardIconButton onClick={handleExpand} size="small">
            {cardExpanded ? (
              <ExpandLess fontSize="inherit" />
            ) : (
              <ExpandMore fontSize="inherit" />
            )}
          </CardIconButton>
        ) : null}
      </TokenContainer>
      <Collapse timeout={225} in={cardExpanded} mountOnEnter unmountOnExit>
        {route.steps.map((step) => (
          <StepActions key={step.id} step={step} mt={2} />
        ))}
        <RouteCardEssentialsExpanded route={route} />
      </Collapse>
      <RouteCardEssentials route={route} />
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
