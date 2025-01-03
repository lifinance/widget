import type { Route } from '@lifi/sdk'
import type { RouteLabel, RouteLabelRule } from '../../types/widget.js'
import { isItemAllowed } from '../../utils/item.js'

export const getMatchingLabels = (
  route: Route,
  routeLabels?: RouteLabelRule[]
): RouteLabel[] => {
  if (!routeLabels?.length) {
    return []
  }

  return routeLabels
    .filter((rule) => {
      const conditions: boolean[] = []

      // Check bridge/exchange matches if specified
      if (rule.bridges || rule.exchanges) {
        const toolNames = route.steps.flatMap((step) =>
          step.includedSteps.map((s) => s.tool)
        )
        conditions.push(
          toolNames.some(
            (toolName) =>
              isItemAllowed(toolName, rule.bridges) &&
              isItemAllowed(toolName, rule.exchanges)
          )
        )
      }

      // Check token matches if specified
      if (rule.fromTokenAddress?.length) {
        conditions.push(rule.fromTokenAddress.includes(route.fromToken.address))
      }

      if (rule.toTokenAddress?.length) {
        conditions.push(rule.toTokenAddress.includes(route.toToken.address))
      }

      // Check chain matches if specified
      if (rule.fromChainId?.length) {
        conditions.push(rule.fromChainId.includes(route.fromChainId))
      }

      if (rule.toChainId?.length) {
        conditions.push(rule.toChainId.includes(route.toChainId))
      }

      // Must have at least one condition and all conditions must be true
      return conditions.length && conditions.every(Boolean)
    })
    .map((rule) => rule.label)
}
