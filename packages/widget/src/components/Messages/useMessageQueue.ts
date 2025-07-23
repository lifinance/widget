import type { Route } from '@lifi/sdk'
import { useMemo } from 'react'
import { useFromTokenSufficiency } from '../../hooks/useFromTokenSufficiency.js'
import { useGasSufficiency } from '../../hooks/useGasSufficiency.js'
import { useRouteRequiredAccountConnection } from '../../hooks/useRouteRequiredAccountConnection.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'

interface QueuedMessage {
  id: string
  priority: number
  props?: Record<string, any>
}

export const useMessageQueue = (route?: Route, allowInteraction?: boolean) => {
  const {
    requiredToAddress,
    toAddress,
    accountNotDeployedAtDestination,
    accountDeployedAtDestination,
    isLoading: isToAddressRequirementsLoading,
  } = useToAddressRequirements(route)
  const { insufficientFromToken, isLoading: isFromTokenSufficiencyLoading } =
    useFromTokenSufficiency(route)
  const { insufficientGas, isLoading: isGasSufficiencyLoading } =
    useGasSufficiency(route)
  const { missingChain, missingAccountAddress } =
    useRouteRequiredAccountConnection(route)
  const { minFromAmountUSD } = useWidgetConfig()

  const isLowerThanMinFromAmountUSD = useMemo(() => {
    if (!minFromAmountUSD || !route?.fromAmountUSD) {
      return false
    }
    return Number(route.fromAmountUSD) < minFromAmountUSD
  }, [minFromAmountUSD, route?.fromAmountUSD])

  const messageQueue = useMemo(() => {
    const queue: QueuedMessage[] = []

    if (missingChain) {
      queue.push({
        id: 'MISSING_ROUTE_REQUIRED_ACCOUNT',
        priority: 1,
        props: { chain: missingChain, address: missingAccountAddress },
      })
    }

    if (insufficientFromToken) {
      queue.push({
        id: 'INSUFFICIENT_FUNDS',
        priority: 2,
      })
    }

    if (insufficientGas?.length) {
      queue.push({
        id: 'INSUFFICIENT_GAS',
        priority: 3,
        props: { insufficientGas },
      })
    }

    if (isLowerThanMinFromAmountUSD) {
      queue.push({
        id: 'MIN_FROM_AMOUNT_USD',
        priority: 4,
        props: { minFromAmountUSD },
      })
    }

    if (accountNotDeployedAtDestination && !allowInteraction) {
      queue.push({
        id: 'ACCOUNT_NOT_DEPLOYED',
        priority: 5,
      })
    }

    if (requiredToAddress && !toAddress) {
      queue.push({
        id: 'TO_ADDRESS_REQUIRED',
        priority: 6,
      })
    }

    if (accountDeployedAtDestination && !allowInteraction) {
      queue.push({
        id: 'ACCOUNT_DEPLOYED',
        priority: 7,
      })
    }

    return queue.sort((a, b) => a.priority - b.priority)
  }, [
    allowInteraction,
    insufficientFromToken,
    insufficientGas,
    accountDeployedAtDestination,
    accountNotDeployedAtDestination,
    requiredToAddress,
    toAddress,
    missingChain,
    missingAccountAddress,
    isLowerThanMinFromAmountUSD,
    minFromAmountUSD,
  ])

  return {
    messages: messageQueue,
    hasMessages: messageQueue.length > 0,
    isLoading:
      isGasSufficiencyLoading ||
      isFromTokenSufficiencyLoading ||
      isToAddressRequirementsLoading,
  }
}
