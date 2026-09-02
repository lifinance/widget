import type { Route } from '@lifi/sdk'
import type { RouteLabel, RouteLabelRule } from '../../types/widget.js'
import { getConfigItemSets, isItemAllowedForSets } from '../../utils/item.js'

const isEvmAddress = (value: string): boolean =>
  /^0x[a-fA-F0-9]{40}$/.test(value)

// The LI.FI API returns EIP-55 checksummed (mixed-case) EVM addresses, while
// integrator config commonly writes them lowercase (including this repo's
// own default config), so EVM addresses must be compared case-insensitively.
// Non-EVM chains (Solana base58, Sui coin types, etc.) use case-sensitive
// identifiers and must be compared exactly.
const matchesTokenAddress = (
  configAddresses: string[],
  routeAddress: string
): boolean => {
  if (isEvmAddress(routeAddress)) {
    const lowerRouteAddress = routeAddress.toLowerCase()
    return configAddresses.some(
      (address) =>
        isEvmAddress(address) && address.toLowerCase() === lowerRouteAddress
    )
  }
  return configAddresses.includes(routeAddress)
}

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
        const bridgesConfigSets = getConfigItemSets(
          rule.bridges,
          (bridges) => new Set(bridges)
        )
        const exchangesConfigSets = getConfigItemSets(
          rule.exchanges,
          (exchanges) => new Set(exchanges)
        )
        conditions.push(
          toolNames.some(
            (toolName) =>
              isItemAllowedForSets(toolName, bridgesConfigSets) &&
              isItemAllowedForSets(toolName, exchangesConfigSets)
          )
        )
      }

      // Check token matches if specified
      if (rule.fromTokenAddress?.length) {
        conditions.push(
          matchesTokenAddress(rule.fromTokenAddress, route.fromToken.address)
        )
      }

      if (rule.toTokenAddress?.length) {
        conditions.push(
          matchesTokenAddress(rule.toTokenAddress, route.toToken.address)
        )
      }

      // Check chain matches if specified
      if (rule.fromChainId?.length) {
        conditions.push(rule.fromChainId.includes(route.fromChainId))
      }

      if (rule.toChainId?.length) {
        conditions.push(rule.toChainId.includes(route.toChainId))
      }

      // Evaluate custom match function if specified
      if (rule.match) {
        conditions.push(rule.match(route))
      }

      // Must have at least one condition and all conditions must be true
      return conditions.length && conditions.every(Boolean)
    })
    .map((rule) => rule.label)
}
