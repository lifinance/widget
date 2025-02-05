import type { Route } from '@lifi/sdk'
import { useMemo } from 'react'
import { useFromTokenSufficiency } from '../../hooks/useFromTokenSufficiency.js'
import { useGasSufficiency } from '../../hooks/useGasSufficiency.js'
import { useIsCompatibleDestinationAccount } from '../../hooks/useIsCompatibleDestinationAccount.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'

interface QueuedMessage {
  id: string
  priority: number
  props?: Record<string, any>
}

export const useMessageQueue = (route?: Route) => {
  const { requiredToAddress, toAddress } = useToAddressRequirements()
  const { isCompatibleDestinationAccount } = useIsCompatibleDestinationAccount()
  const { insufficientFromToken } = useFromTokenSufficiency(route)
  const { insufficientGas } = useGasSufficiency(route)

  const messageQueue = useMemo(() => {
    const queue: QueuedMessage[] = []

    if (insufficientFromToken) {
      queue.push({
        id: 'INSUFFICIENT_FUNDS',
        priority: 1,
      })
    }

    if (insufficientGas?.length) {
      queue.push({
        id: 'INSUFFICIENT_GAS',
        priority: 2,
        props: { insufficientGas },
      })
    }

    if (!isCompatibleDestinationAccount) {
      queue.push({
        id: 'ACCOUNT_NOT_DEPLOYED',
        priority: 3,
      })
    }

    if (requiredToAddress && !toAddress) {
      queue.push({
        id: 'TO_ADDRESS_REQUIRED',
        priority: 4,
      })
    }

    return queue.sort((a, b) => a.priority - b.priority)
  }, [
    isCompatibleDestinationAccount,
    insufficientFromToken,
    insufficientGas,
    requiredToAddress,
    toAddress,
  ])

  return {
    currentMessage: messageQueue[0],
    hasMessages: messageQueue.length > 0,
  }
}
